require("component-responsive-frame/child");
var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycby8ulrtzEgQRS4iW-ka5E-epv7U5BxTX2gzvOASZ_eXFkJnGkykSSYZ8SvwSh02ijLa/exec';

var votes = require("../../data/predictions.sheet.json");

var width = $(".entry").width();
var obj = {};
var catObj = {};
var savedPicks = [];



function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
    return v ? v[2] : null;
}

function submitHandler(e, entry){
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


$( ".completeEntry" ).click(function(a) {
  var thisEntry = $(this).find('.entry');
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
  $( chosenEntry ).closest('.catGroup').find('.knockout').addClass('darken');
  $( chosenEntry ).closest('.catGroup').find(".completeEntry").css("pointer-events","none");
  $( chosenEntry ).closest('.catGroup').find(".crit_pics").show();
  // $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.img img').css('opacity','1');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').addClass('voted');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').append('<div class="youVote"><i class="fa fa-star" aria-hidden="true"></i>Your Vote</div>');
}


function showVoteTallies(selectedCategory, chosenMovie) {
  var catTotal = catObj[selectedCategory];

  catTotal = (catTotal === undefined) ? 1 : catTotal;

  if (catTotal === 1) {
    console.log(obj);
    obj[chosenMovie] = 1;
    console.log(obj);
  } else {

  }

  $('#nom-holder').find(`*[data-head-category="${ selectedCategory }"]`).prev('.pollHeads').find('.numVotes').append(`${catTotal} votes`);

  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];


      var percentage = (value / catTotal) * 100;
      var perVotes = Math.round(percentage);

      // I work for the bar chart lines.
      // $('#nom-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);
      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).closest('.completeEntry').find('.perVotes').empty().append(`${perVotes}<span class="percentSign">%</span>`);
    }
  }
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
