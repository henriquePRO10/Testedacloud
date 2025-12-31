// Cloudflare Workers Types
/// <reference types="@cloudflare/workers-types" />

interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET - Listar todas as categorias
        if (request.method === 'GET') {
            const { results } = await env.DB.prepare(
                'SELECT * FROM categories ORDER BY name'
            ).all();

            return new Response(JSON.stringify(results), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // POST - Criar ou atualizar categoria
        if (request.method === 'POST') {
            const category = await request.json();

            await env.DB.prepare(
                'INSERT OR REPLACE INTO categories (id, name, color) VALUES (?, ?, ?)'
            ).bind(category.id, category.name, category.color).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // DELETE - Remover categoria
        if (request.method === 'DELETE') {
            const id = url.searchParams.get('id');

            if (!id) {
                return new Response(JSON.stringify({ error: 'ID não fornecido' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        return new Response('Method not allowed', {
            status: 405,
            headers: corsHeaders
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
};
