import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * Configuração do adapter OpenNext para Cloudflare Workers.
 *
 * Sem cache incremental configurado, de propósito: nenhuma rota usa ISR. As
 * páginas de edição e de nível são estáticas, servidas direto do storage de
 * assets do Worker, e o único estado em tempo de execução vive no D1. Isso
 * dispensa o bucket R2 que o `NEXT_INC_CACHE_R2_BUCKET` exigiria.
 *
 * Se algum dia uma rota passar a usar `revalidate`, é aqui que o cache entra.
 */
export default defineCloudflareConfig()
