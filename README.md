# bear-and-raccoon-site
Bear and Raccoon Love
A website I designed for my partner to cheer her up when she misses me
I've got the site hosted for now on cloudflare pages, I access it with dash.cloudflare.com. There's a Worker that handles the .js and the date is stored in KV in order to not generate the image more than once a day. (Costs 0.04 each time) I've got a basic .html on the frontend. I'm using oepnAI for the API, which I have saved as a secret in my worker settings and called upon in the .js
