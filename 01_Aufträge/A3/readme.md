# installation 
install denojs 
`sudo apt install deno`
run webserver with 
`deno run --allow-net deno_webser_server.js`

# flexbox und grid 
ich habe die buttons von dem midi pad akai mini nachmodelliert so dass sie über denen vom bild stehen. 
dazu habe ich zwei flexboxen die horizontal verlaufen verwendet und eine die vertikal verläuft. 
das 8x8 grid der haupt buttons habe ich mit css grid realisiert. 

# relativitaet
da die buttons und slider relativ zum eltern div stehen und die groessen mit % angegeben sind, werden alle buttons und slider automatisch und korrekt mitskalier sobald der container skaliert wird. 

# responsiveness

ich habe drei breakpoints eingebracht so dass bei 1200px 4 container , bei 768px 2 container und bei 320px nur noch ein container pro zeile angezeigt wird. 


