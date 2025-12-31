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
        // GET - Listar todas as tarefas
        if (request.method === 'GET') {
            const { results } = await env.DB.prepare(
                'SELECT * FROM tasks ORDER BY createdAt DESC'
            ).all();

            return new Response(JSON.stringify(results), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // POST - Criar ou atualizar tarefa
        if (request.method === 'POST') {
            const task = await request.json();

            await env.DB.prepare(
                'INSERT OR REPLACE INTO tasks (id, title, content, categoryId, deadline, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(
                task.id,
                task.title,
                task.content,
                task.categoryId,
                task.deadline,
                task.createdAt
            ).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // DELETE - Remover tarefa
        if (request.method === 'DELETE') {
            const id = url.searchParams.get('id');

            if (!id) {
                return new Response(JSON.stringify({ error: 'ID não fornecido' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();

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
