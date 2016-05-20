$.getJSON("https://extraction.import.io/query/extractor/4939f135-ed39-4958-9879-daf2e963a677?_apikey=fd37789720a448d1870ace56a441e09396a806be861e3eec675bb83ce96306ba553025879111a5e1405903e4371352c93cccbdf1a15b8e6379548c6e42e873669ce1ec8ee689915250bf55c85ef31b43&url=https%3A%2F%2Fgithub.com%2Fhootalex%2Fpersonalsite", function(response){
  ;

console.log(response.extractorData.data[0].group[6].date[0].text)
console.log(response.extractorData.data[0].group[6].comment[0].text)
$( "#lastedit" ).prepend("Last updated "+response.extractorData.data[0].group[6].date[0].text+" because "+response.extractorData.data[0].group[6].comment[0].text)

});
