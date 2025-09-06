import {
    f_websersocket_serve, 
    f_v_before_return_response__fileserver,
    f_v_before_return_response__proxy
} from "https://deno.land/x/websersocket@6.2.0/mod.js"


let s_path_file_current = new URL(import.meta.url).pathname;
let s_path_folder_current = s_path_file_current.split('/').slice(0, -1).join('/'); 
// console.log(s_path_folder_current)
// Deno.exit()
await f_websersocket_serve(
    [
        {
            b_https: false,
            n_port: 8080,
            s_hostname: 'localhost',
            f_v_before_return_response: async function(o_request){


                return f_v_before_return_response__fileserver(
                    o_request,
                    `.`//${s_path_folder_current}`
                )
            }
        },


    ]
)
