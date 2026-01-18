require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, Events } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Constants
const ADMIN_ID = '1088195166302642288';

const commands = [
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

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // --- USER COMMANDS ---

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
