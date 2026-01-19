'use server'

import { checkPermission } from "@/utils/permissions"

export async function getUserPermissions(serverId: string) {
    if (!serverId) return null;

    const [canEditServer, canManageSubscription, canDeleteServer] = await Promise.all([
        checkPermission(serverId, 'can_edit_server'),
        checkPermission(serverId, 'can_manage_subscription'),
        checkPermission(serverId, 'can_delete_server')
    ]);

    return {
        canEditServer,
        canManageSubscription,
        canDeleteServer
    }
}
