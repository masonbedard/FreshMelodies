(function () {
// scroll bar for left me

// auto complete
var availableTags = 
      ["Alternative","Dance","Electronic","Rap/Hip Hop","Pop","Jazz","Reggae","Folk",
       "Rock","Noise","Trap","Groovy","Funk","Nu Disco","House","Future Garage","Experimental"];
$( "#g_complete" ).autocomplete({
  source: availableTags
});
$( "#genre" ).autocomplete({
  source: availableTags
});




}());
