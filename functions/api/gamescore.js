export async function onRequest(context) {
    const { request, env } = context;

    // GET: Return the current high score
    if (request.method === 'GET') {
        const score = await env.GAME_DATA.get("flappy_high_score") || "0";
        return new Response(score);
    }
      
    // POST: Save a new high score
    if (request.method === 'POST') {
        const body = await request.json();
        const newScore = body.score;
        const currentScore = parseInt(await env.GAME_DATA.get("flappy_high_score") || "0");

        if (newScore > currentScore) {
            await env.GAME_DATA.put("flappy_high_score", newScore.toString());
            return new Response(JSON.stringify({ success: true, score: newScore }), { 
                headers: { "Content-Type": "application/json" } 
            });
        }
        return new Response(JSON.stringify({ success: false }), { 
            headers: { "Content-Type": "application/json" } 
        });
    }

    return new Response("Method Not Allowed", { status: 405 });
}