This is something I thought would be fun but it turned into a massive headache, Here are the commands I am basing this off

Create new sink with name:  
`pactl load-module module-null-sink sink_name="${name}" sink_properties=device.description="${name}`

Forward sink to headphones:  
`pactl load-module module-loopback source="${name}.monitor" sink=${output} rate=44100`

Get Application output sink ID: (Accept name input in format "Application Name")  
`pacmd list-sink-inputs | tr '\n' '\r' | perl -pe 's/ *index: ([0-9]+).+?application\.process\.binary = "([^\r]+)"\r.+?(?=index:|$)/\2:\1\r/g' | tr '\r' '\n'`

Get General output sink ID: (Accept name input in format "full card name")  
`pacmd list-sinks | tr '\n' '\r' | perl -pe 's/ *index: ([0-9]+).+?name: <([^\r]+)>\r.+?(?=index:|$)/\2:\1\r/g' | tr '\r' '\n'`

Forward Application Output to general output:  
`pacmd move-sink-input <App> <Out>`