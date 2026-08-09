-- A função administrativa já existia no projeto remoto como SECURITY DEFINER.
-- Retira sua execução da Data API e mantém somente o papel server-side.
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
grant execute on function public.rls_auto_enable() to service_role;
