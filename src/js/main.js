require("component-responsive-frame/child");
var $ = require('jquery');
var Isotope = require('isotope-layout');
var jQueryBridget = require('jquery-bridget');
jQueryBridget( 'isotope', Isotope, $ );
var scriptURL = 'https://script.google.com/macros/s/AKfycby8ulrtzEgQRS4iW-ka5E-epv7U5BxTX2gzvOASZ_eXFkJnGkykSSYZ8SvwSh02ijLa/exec';

var votes = require("../../data/predictions.sheet.json");

var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

var width = $(".entry").width();
var obj = {};
var catObj = {};
var savedPicks = [];

var bestActor,
    bestActress,
    bestPicture,
    bestDirector,
    bestSupActor,
    bestSupActress,
    bestAnimated,
    bestCinematography,
    bestCostume,
    bestDoc,
    bestDocShort,
    bestEditing,
    bestInternational,
    bestMakeup,
    bestScore,
    bestSong,
    bestProduction,
    bestAnimatedShort,
    bestLiveShort,
    bestSound,
    bestVisuals,
    bestAdaptedScreenplay,
    bestOriginalScreenplay;

var sortVariables = {
  bestPicture: bestPicture,
  bestActor: bestActor,
  bestActress: bestActress,
  bestDirector: bestDirector,
  bestSupActor: bestSupActor,
  bestSupActress: bestSupActress,
  bestAnimated: bestAnimated,
  bestCinematography: bestCinematography,
  bestCostume: bestCostume,
  bestDoc: bestDoc,
  bestDocShort: bestDocShort,
  bestEditing: bestEditing,
  bestInternational: bestInternational,
  bestMakeup: bestMakeup,
  bestScore: bestScore,
  bestSong: bestSong,
  bestProduction: bestProduction,
  bestAnimatedShort: bestAnimatedShort,
  bestLiveShort: bestLiveShort,
  bestSound: bestSound,
  bestVisuals: bestVisuals,
  bestAdaptedScreenplay: bestAdaptedScreenplay,
  bestOriginalScreenplay: bestOriginalScreenplay
};

$( ".catGroup" ).each(function( index ) {
  console.log( $(this).attr("id") );
  var gridID = $(this).attr("id");
  sortVariables[gridID] = $(this).isotope({
   itemSelector: '.entry',
   layoutMode: 'vertical',
   // initLayout: false,
   resizeContainer: true,
   // resize: false,
   getSortData: {
     trythis: '.perVotes parseInt',
   }
  });

});







function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
    return v ? v[2] : null;
}

function submitHandler(e, entry){
    e.preventDefault();
    var title = $( entry ).attr( "data-title" );
    var category = $( entry ).attr( "data-category" );
    var actor = $( entry ).attr( "data-actor" );
    var thisMovie = $( entry ).attr( "data-id" );
    savedPicks.push(thisMovie + "|" + category);


    var formData = new FormData();


    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( category ) ) {
      catObj[category] = (catObj[category] + 1);
    } else {
      catObj[category] = 1;
    }


    formData.append("vote", title);
    formData.append("category", category);
    formData.append("actor", actor);

    showVoteTallies(category);


    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "OscVotesActor="+savedPicks + "; expires=" + d.toGMTString() + ";";
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));

    // getCookie("OscVotesActor");
}


$( ".entry" ).click(function(a) {
  a.preventDefault();
  var thisEntry = $(this);
  submitHandler(a, thisEntry);
  highlightChosenFadeOthers(thisEntry);
});


///////////////////////

$.each(votes, function(index, element) {
    var thisMovie = element.vote + element.category + element.actor;

    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( element.category ) ) {
      catObj[element.category] = (catObj[element.category] + 1);
    } else {
      catObj[element.category] = 1;
    }
});


function highlightChosenFadeOthers( chosenEntry ){
  // $( chosenEntry ).closest('.catGroup').find('.img img').css("opacity","0.4");
  $( chosenEntry ).closest('.catGroup').find('.entry').addClass('darken');
  $( chosenEntry ).closest('.catGroup').find(".entry").css("pointer-events","none");
  $( chosenEntry ).closest('.catGroup').find(".crit_pics").show();
  // $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.img img').css('opacity','1');
  $( chosenEntry ).addClass('voted').find('.knockout').addClass('voted');
  $( chosenEntry ).addClass('voted').append('<div class="youVote"><div class="center"><i class="fa fa-star" aria-hidden="true"></i>Your Vote</div></div>');
}




function showVoteTallies(selectedCategory, chosenMovie) {
  var catTotal = catObj[selectedCategory];

  catTotal = (catTotal === undefined) ? 1 : catTotal;
  console.log(catTotal);

  if (catTotal === 1) {
    console.log(obj);
    obj[chosenMovie] = 1;
    console.log(obj);
  } else {

  }

  $('.nom-holder').find(`*[data-head-category="${ selectedCategory }"]`).prev('.pollHeads').find('.numVotes').append(`${commafy(catTotal)} votes`);

  var chosenGroupID = $('.nom-holder').find(`*[data-head-category="${ selectedCategory }"]`).attr("id");
  // $('.nom-holder').find(`*[data-head-category="${ selectedCategory }"]`).find('.percentSign').addClass('show');


  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];


      var percentage = (value / catTotal) * 100;
      var perVotes = Math.round(percentage);

      // I work for the bar chart lines.
      // $('#nom-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);

      $('.nom-holder').find(`*[data-id="${ propertyName }"]`).find('.perVotes').empty().append(`${perVotes}`);
      $('.nom-holder').find(`*[data-id="${ propertyName }"]`).find('.percentSign').addClass('show');

      // <span class="percentSign">%</span>
    }
  }



  $(sortVariables[`${chosenGroupID}`]).isotope( 'reloadItems' ).isotope( { sortBy: 'trythis', sortAscending : false } );
}

// if (getCookie("OscVotesActor")) {
//   var pickedArray = getCookie("OscVotesActor");
//   savedPicks.push(pickedArray);
//   var pickedSplitArray = pickedArray.split(",");
//
//   $.each(pickedSplitArray, function(index, element) {
//     var movAndCat = element.split("|");
//     showVoteTallies(movAndCat[1], movAndCat[0]);
//     console.log(movAndCat[0]);
//     highlightChosenFadeOthers( $(`*[data-id="${ movAndCat[0] }"]`)  );
//   });
//
// } else {
//   console.log("Vote with reckless abandon");
// }
