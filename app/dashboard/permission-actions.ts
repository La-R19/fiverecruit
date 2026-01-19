'use server'

import { checkPermission } from "@/utils/permissions"

export async function getUserPermissions(serverId: string) {
    if (!serverId) return null;

    const [canEditServer, canManageSubscription] = await Promise.all([
        checkPermission(serverId, 'can_edit_server'),
        checkPermission(serverId, 'can_manage_subscription')
    ]);

    return {
        canEditServer,
        canManageSubscription
    }
}
