
export type PermissionKey =
    | 'can_create_jobs'
    | 'can_edit_jobs'
    | 'can_delete_jobs'
    | 'can_view_applications'
    | 'can_manage_applications'
    | 'can_delete_applications'
    | 'can_edit_server'
    | 'can_manage_team'
    | 'can_view_stats'
    | 'can_manage_subscription'
    | 'can_delete_server';

export const DEFAULT_PERMISSIONS = {
    manager: {
        can_create_jobs: true,
        can_edit_jobs: true,
        can_delete_jobs: true,
        can_view_applications: true,
        can_manage_applications: true,
        can_delete_applications: false,
        can_edit_server: false,
        can_manage_team: false,
        can_view_stats: true,
        can_manage_subscription: false,
        can_delete_server: false
    }
};
