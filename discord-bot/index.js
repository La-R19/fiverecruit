require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Constants
const ADMIN_ID = '1088195166302642288';

// /myservers (User)
new SlashCommandBuilder()
    .setName('myservers')
    .setDescription('Voir mes serveurs FiveRecruit'),

    // /applications (User)
    new SlashCommandBuilder()
        .setName('applications')
        .setDescription('Voir les candidatures en attente')
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Refreshing commands...');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Commands reloaded.');
    } catch (error) {
        console.error(error);
    }
})();

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

async function getUserProfile(discordId) {
    const { data, error } = await supabase
        .rpc('get_user_by_discord_id', { p_discord_id: discordId })
        .single();

    if (error || !data) return null;
    return { id: data.user_id, username: data.username };
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // --- ADMIN COMMANDS ---

    // /genkey
    if (interaction.commandName === 'genkey') {
        if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Non autorisé.", ephemeral: true });

        const plan = interaction.options.getString('plan');
        const jobs = interaction.options.getInteger('jobs');
        const days = interaction.options.getInteger('days');
        const key = generateLicenseKey();

        let expiresAt = null;
        if (days > 0) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            expiresAt = date.toISOString();
        }

        await interaction.deferReply({ ephemeral: true });

        const { error } = await supabase
            .from('licenses')
            .insert({ key: key, plan: plan, max_jobs: jobs, expires_at: expiresAt });

        if (error) return interaction.editReply(`❌ Erreur: ${error.message}`);

        await interaction.editReply({
            content: `✅ **Licence Générée**\n🔑 \`${key}\`\n💎 ${plan.toUpperCase()} (${jobs} offres)`
        });
    }

    // /listkeys
    if (interaction.commandName === 'listkeys') {
        if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Non autorisé.", ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        // Fetch ALL licenses with server name
        const { data: licenses, error } = await supabase
            .from('licenses')
            .select('*, servers(name)')
            .order('created_at', { ascending: false });

        if (error) return interaction.editReply(`❌ Erreur DB: ${error.message}`);
        if (!licenses || licenses.length === 0) return interaction.editReply("Aucune licence trouvée.");

        const lines = licenses.map(l => {
            // Check if server exists (joined data)
            const serverName = l.servers?.name ? `🟢 ${l.servers.name}` : '🔴 Non activée';
            return `\`${l.key}\` | ${l.plan} | ${serverName}`;
        });

        const fullText = lines.join('\n');

        // Send as file if too long
        if (fullText.length > 1900) {
            const buffer = Buffer.from(fullText, 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'toutes_les_licences.txt' });
            return interaction.editReply({
                content: `📋 **Liste Complète (${licenses.length} licences)**\n(Liste trop longue pour Discord, voir fichier joint)`,
                files: [attachment]
            });
        } else {
            interaction.editReply(`**Liste des Licences (${licenses.length}) :**\n${fullText}`);
        }
    }

    // /delkey
    if (interaction.commandName === 'delkey') {
        if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: "❌ Non autorisé.", ephemeral: true });

        const key = interaction.options.getString('key');
        await interaction.deferReply({ ephemeral: true });

        const { error } = await supabase.from('licenses').delete().eq('key', key);

        if (error) return interaction.editReply(`❌ Erreur: ${error.message}`);
        interaction.editReply(`✅ Licence \`${key}\` supprimée.`);
    }

    // --- USER COMMANDS ---

    // /myservers
    if (interaction.commandName === 'myservers') {
        await interaction.deferReply({ ephemeral: true });

        const profile = await getUserProfile(interaction.user.id);
        if (!profile) return interaction.editReply("❌ Tu n'es pas inscrit sur FiveRecruit.");

        const { data: servers } = await supabase
            .from('servers')
            .select('*')
            .eq('owner_id', profile.id);

        if (!servers || servers.length === 0) {
            return interaction.editReply("Tu n'as créé aucun serveur.");
        }

        const embed = new EmbedBuilder()
            .setTitle(`📂 Tes Serveurs (${servers.length})`)
            .setColor(0x0099FF)
            .setDescription(servers.map(s => `• **${s.name}**\n  🔗 [Gérer](https://fiverecruit.com/dashboard/server/${s.id})`).join('\n\n'));

        await interaction.editReply({ embeds: [embed] });
    }

    // /applications
    if (interaction.commandName === 'applications') {
        await interaction.deferReply({ ephemeral: true });

        const profile = await getUserProfile(interaction.user.id);
        if (!profile) return interaction.editReply("❌ Tu n'es pas inscrit sur FiveRecruit.");

        const { data: apps, error } = await supabase
            .from('applications')
            .select(`
                id,
                created_at,
                status,
                profiles (username),
                jobs!inner (
                    title,
                    servers!inner (
                        owner_id,
                        name
                    )
                )
            `)
            .eq('jobs.servers.owner_id', profile.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !apps) return interaction.editReply("❌ Erreur ou aucune candidature.");
        if (apps.length === 0) return interaction.editReply("✅ Aucune candidature en attente !");

        const embed = new EmbedBuilder()
            .setTitle(`📝 Candidatures en attente`)
            .setColor(0xFFA500)
            .setDescription(apps.map(app => {
                // @ts-ignore
                const serverName = app.jobs?.servers?.name;
                // @ts-ignore
                const jobTitle = app.jobs?.title;
                // @ts-ignore
                const candidate = app.profiles?.username || 'Inconnu';
                return `• **${candidate}** pour *${jobTitle}* (${serverName})`;
            }).join('\n'));

        await interaction.editReply({ embeds: [embed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
