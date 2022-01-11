var axios=require('axios');
var cheerio=require('cheerio');

function get_bloomberg(){
  var url="https://playerservices.streamtheworld.com/api/livestream?transports=hls&version=1.8&mount=WBBRAMAAC48";
  //this url is used to retrieve the bloomberg stream url

  return new Promise(function(resolve, reject){
    axios.get(url).then(function(response){
      var body=cheerio.load(response.data, {xmlMode: true});
      var transport_suf=body("transport")
      console.log(`transport_suf=${transport_suf}`);
      var server_ip=body("server ip");
      console.log(`server_ip=${server_ip}`);
      var mount=body("mount");
      console.log(`mount=${mount}`);
      var playlistUrl=`https://${server_ip.first().text()}/${mount.text()}${transport_suf.attr('mountSuffix')}`;
      console.log(`playlistUrl=${playlistUrl}`);
      resolve(playlistUrl);
    });
  });
}

get_bloomberg().then(function(playlistUrl){
  axios.get(playlistUrl).then(function(response){
    var body=response.data.toString();
    console.log(body);
    var http_search=body.search("https://");
    console.log(http_search);
    var sessionStreamUrl=body.slice(http_search).split('\n')[0];
    console.log(playlistUrl);
    console.log(`bloomberg radio session stream=${sessionStreamUrl}`);

  })
});
