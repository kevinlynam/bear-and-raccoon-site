export async function onRequest(context) {
    const { env } = context;

    // Get the current date specifically in Mountain Time
    const mtDateString = new Date().toLocaleString("en-US", {
        timeZone: "America/Denver",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const [month, day, year] = mtDateString.split('/');
    const today = `${year}-${month}-${day}`;

    // CHECK THE MEMORY 
    const cachedData = await env.DAILY_STORE.get(today);
    if (cachedData) {
        return new Response(cachedData, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // THE EXPANDED RANDOMIZER INGREDIENTS
    const actions = [
      "floating down a lazy river", 
      "looking confusingly at a compass",
      "paddling a tiny wooden boat", 
      "fingerpainting potraits of each other",
      "taking sips from tiny tiny mugs", 
      "building a kitty tree and scratching post",
      "investigating a cool bug",
      "trying to hug local wildlife",
      "flying a colorful kite",
      "eating a giant pile of berries",
      "building a castle out of interlocking plastic building bricks",
      "looking through a telescope together",
      "sharing a massive, towering sandwich",
      "knitting matching oversized winter scarves",
      "napping peacefully side-by-side in a giant hammock",
      "riding on bicycles together", 
      "digging for dinosaur bones",
      "rubbing a kitty's belly",
      "opening a blind box to find a little guy",
      "laughing at a derpy lizard",
      "holding each others hands and strolling",
      "tinkering with old technology",
      "building puzzles together",
      "playing video games together",
      "sorting through a large pile of socks",
      "placing saddles on enormous kitties to ride",
      "floating rubber duckies down a river",
      "picking fruit together",
      "cuddling in a hammock with two kitties",
      "placing a stone path in their backyard",
      "feeding a hummingbird",
      "sharing an oversized cup of hot cocoa",
      "taking a nap on a mossy log",
      "reading an ancient, glowing scroll",
      "painting a portrait of each other",
      "roasting marshmallows over a magical flame",
      "gazing at a tiny holographic map",
      "having a picnic with miniature sandwiches",
      "flying a kite made of silk and starlight",
      "playing a game of giant checkers",
      "tending to a garden of crystal flowers",
      "gazing through a brass telescope",
      "building a house out of gingerbread",
      "balancing on a tightrope made of ivy",
      "catching falling stars with a net",
      "blowing bubbles that turn into tiny birds",
      "sharing a secret whispered into a seashell",
      "dancing a clumsy but happy waltz",
      "decorating a tree with glowing lanterns",
      "eating giant blue raspberries",
      "knitting a scarf long enough for both of them",
      "watching a parade of clockwork ladybugs",
      "sketching in a leather-bound journal",
      "making a wish at a shimmering fountain",
      "arranging a bouquet of neon mushrooms",
      "sharing a single long piece of spaghetti"
    ];
    
    const locations = [
      "in a bioluminescent mushroom forest", 
      "on top of a snowy mountain peak",
      "inside a cozy, cluttered wizard's study", 
      "on a floating island in the sky",
      "next to a sparkling crystal river", 
      "in a bustling steampunk market",
      "deep inside a glowing crystal cave",
      "in a peaceful Japanese zen garden",
      "surrounded by giant, towering sunflowers",
      "inside a cozy home built into a hollowed-out oak tree",
      "on a quiet sandy beach with turquoise water",
      "in a secret underground library full of dusty books",
      "aboard a small, cozy wooden airship",
      "in a vibrant meadow filled with knee-high wildflowers",
      "inside a warm bakery smelling of fresh bread",
      "within a forgotten temple overgrown with emerald vines",
      "atop a giant tortoise wandering through a desert of red sand",
      "inside a giant hollowed-out pumpkin lantern",
      "under a canopy of cherry blossoms in perpetual bloom",
      "at the edge of a waterfall that flows toward the stars",
      "inside a lighthouse overlooking a sea of endless clouds",
      "in a whimsical village made of giant porcelain tea sets",
      "buried in a massive pile of soft, velvet pillows",
      "floating in a shimmering bubble over a neon coral reef",
      "inside a mechanical clocktower's rhythmic gear room",
      "walking through a field of glowing, musical lavender",
      "sitting in a garden cafe inside a giant glass greenhouse",
      "tucked away in a tiny attic room under a starry skylight",
      "on a bridge made of solid rainbows spanning a deep canyon",
      "at a masquerade ball in a grand palace made of ice",
      "inside a luxury treehouse high in the rainforest canopy",
      "in a cavern filled with giant, ancient glowing fossils",
      "amidst a grove of whispering silver birch trees",
      "on the deck of a galleon sailing a sea of liquid gold",
      "inside a cozy log cabin during a soft, magical snowstorm",
      "in a garden of glass flowers that chime in the breeze",
      "atop a creaking windmill turning over a sea of wheat",
      "in a hidden valley where it is always a crisp autumn afternoon",
      "inside a crystal ballroom filled with friendly dancing ghosts",
      "on a winding path through a giant emerald hedge maze",
      "at a cozy campsite under the protective arc of a prehistoric ribcage",
      "inside a Victorian parlor with a roaring violet fireplace",
      "in a sky-high nest made of golden straw and silk",
      "aboard a futuristic train traveling through a colorful nebula",
      "inside a giant iridescent seashell at the bottom of the ocean",
      "in a whimsical toy shop where the clocks run backward",
      "on a balcony overlooking a city of floating paper lanterns",
      "inside an ancient observatory with a giant brass telescope",
      "in a field of oversized dandelions tall enough to sit under",
      "at a moonlit campfire within a circle of ancient standing stones"
    ];
    
    const atmospheres = [
      "during a warm golden hour sunset", 
      "under a breathtaking starry night sky",
      "on a crisp, foggy autumn morning", 
      "during a gentle, peaceful rainstorm",
      "illuminated by dancing fireflies",
      "bathed in bright, cheerful midday sunlight",
      "while a soft, magical snow is gently falling",
      "under the vibrant, dancing lights of the aurora borealis",
      "lit by the warm, flickering light of a campfire",
      "during a dramatic, colorful pink and purple sunrise",
      "under a massive, glowing full moon",
      "as rays of light pierce through a thick canopy of leaves",
      "surrounded by floating, glowing embers",
      "in the calm, quiet twilight just after the sun goes down",
      "in a gentle flurry of drifting dandelion seeds",
      "while colorful floating bubbles drift past",
      "illuminated by a soft, ethereal teal glow",
      "under a sky painted in swirls of cosmic nebula",
      "surrounded by a field of translucent, glass-like flowers",
      "as gentle, glowing pollen falls like glitter",
      "bathed in the soft blue light of a lunar eclipse",
      "under a rain of soft, velvet-like flower petals",
      "as the world is tinted in vintage sepia tones",
      "while tiny, friendly spirits watch from the shadows",
      "in a hazy, dreamlike pastel-colored mist",
      "illuminated by the pulse of bioluminescent vines",
      "under a giant, shimmering soap bubble dome",
      "as golden leaves swirl in a magical breeze",
      "while a soft, lo-fi melody seems to hang in the air",
      "under a canopy of shimmering, metallic leaves",
      "as the horizon glows with an emerald green flash",
      "surrounded by floating, weightless water droplets",
      "in the shimmering heat haze of a magical desert",
      "as a soft, purple dusk settles over the land",
      "illuminated by the soft light of a thousand candles",
      "under a sky filled with migrating paper cranes",
      "while a ring of tiny rainbows surrounds them",
      "as the environment turns into a soft chalkboard drawing",
      "bathed in the flickering neon lights of a distant city",
      "under the protective branches of a crystal tree",
      "as soft, puffy clouds float at eye level",
      "while the air is filled with the scent of pine and cinnamon",
      "in a world where everything is made of soft yarn",
      "as the ground sparkles with crushed diamond dust",
      "under a sky where two suns are setting together",
      "while holographic butterflies flutter around",
      "as shadows dance and come to life",
      "in a warm, nostalgia-soaked memory haze",
      "illuminated by the sparkling trail of a passing comet",
      "during a vibrant, double-rainbow afternoon"
    ];

    // SPIN THE WHEEL
    const action = actions[Math.floor(Math.random() * actions.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const atmosphere = atmospheres[Math.floor(Math.random() * atmospheres.length)];

    // BUILD THE PROMPT
    const aiPrompt = `A cute, wholesome 3D Pixar-style illustration of one shaggy brown bear and one plump raccoon ${action} ${location}, ${atmosphere}. High-quality 3D render, soft cinematic lighting, highly detailed textures.`;
    const displayMessage = `Today, Bear and Raccoon are ${action} ${location}.`;

    try {
        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: aiPrompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            })
        });

        const aiData = await openAIResponse.json();
        
        if (aiData.error) {
            return new Response(JSON.stringify({ imageUrl: "", message: `OpenAI Error: ${aiData.error.message}` }), { status: 500 });
        }

        // SAVE AND SEND
        const finalResponseJSON = JSON.stringify({
            imageUrl: `data:image/png;base64,${aiData.data[0].b64_json}`,
            message: displayMessage
        });

        await env.DAILY_STORE.put(today, finalResponseJSON);

        return new Response(finalResponseJSON, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ imageUrl: "", message: `Worker crashed: ${err.message}` }), { status: 500 });
    }
}