/*----------------------------------*\
	* Mini Quiz - The Review Helper
	* Created by: JP Aguilar
	* Date: January 12, 2014
	-
	* Updated: January 14, 2014
\*----------------------------------*/

$(document).ready(function(){
	// assets
	$div_theBar = $('<div id="theBar" title="Progress"></div>');
	$div_nth = $('<div id="nth" title="Current item"></div>');
	$div_complete_nth = $('<div id="complete-nth" title="Total items"></div>');
	
	// sub-assets
	var complete = false;
	var questionIndex = 1;
	var progress = 0;
	
	document.body.oncontextmenu = function(){return false};

	setTimeout(function(){
		$('body').scrollTop(0);
	}, 100);
	
	$(window).mousedown(function(e){
		var code = e.keyCode || e.which;
		if (code==2) e.preventDefault();
	});

	var itemsAreAllAnswered = false;
	$(window).scroll(function(){
		if (itemsAreAllAnswered) {
			if ($(window).scrollTop() + $(window).height() > $(document).height() - (screen.height/2)) {
				$('#finish_btn').addClass('sneak');
			} else {
				$('#finish_btn').removeClass('sneak');
			}
		}
		
		// box-shadow
		if ($('div#post-nav').length > 0) {
			if ($(window).scrollTop() == 0) {
				$('div#post-nav').css('box-shadow', 'none');
			} else if ($(window).scrollTop() <= 100) {
				$('div#post-nav').css('box-shadow', '0 0 1px 1px rgba(0,0,0,0.1)');
			} else if ($(window).scrollTop() <= 200) {
				$('div#post-nav').css('box-shadow', '0 0 2px 2px rgba(0,0,0,0.1)');
			} else if ($(window).scrollTop() <= 300) {
				$('div#post-nav').css('box-shadow', '0 0 3px 3px rgba(0,0,0,0.1)');
			} else if ($(window).scrollTop() <= 400) {
				$('div#post-nav').css('box-shadow', '0 0 4px 4px rgba(0,0,0,0.1)');
			} else {
				$('div#post-nav').css('box-shadow', '0 0 5px 5px rgba(0,0,0,0.1)');
			}
		}
	});
	
	// shuffle question
	shuffle(question);
	
	var itemList = new Array();
	var Item = function(question, answer, choices){
		this.question = question;
		this.answer = answer;
		this.choices = choices;
	};
	
	// collect items as list
	initStage1();
	function initStage1() {
		shuffle(question);
		
		
		for (i in question) {
			var q = question[i][0]; //question
			var a = question[i][1]; //answer
			var c = new Array(); //choices
		
			// number of choices
			var num_choices = question.length<4? question.length : 4;
			
			var correctAnswerIncluded = false;
			// generate n unique random numbers for choices
			var n_array = new Array(); 
			while (n_array.length < num_choices) {
				var n = Math.floor(Math.random() * question.length);
				
				var alreadyIn = false;
				
				for (var i = 0; i < n_array.length; i++) {
					if (n_array[i]==n) {
						// it is already in!
						alreadyIn = true;
						break;
					}
				}
				
				// include n because it's unique
				if (!alreadyIn) n_array.push(n);
			}
			
			for (var ci = 0; ci < num_choices; ci++) {
				
				// n_array[] is an array that holds the generated n of unique random numbers
				aa = question[n_array[ci]][1];
				c.push(aa);
				
				// correct answer is included :)
				if (a==aa) correctAnswerIncluded=true;
			}
			
			// if correct answer is forgotten to included in choices, included it now!
			if (!correctAnswerIncluded) {
				var n = Math.floor(Math.random() * c.length);
				c[n] = a;
			}
			
			shuffle(c);
			var item = new Item(q,a,c);
			itemList.push(item); 
		}
		
		shuffle(itemList);
	}
	
	// display list as item
	initStage2();
	function initStage2() {
		$('div#c-c-item').html('');
		shuffle(itemList);
		
		for (n in itemList) {
			var q = itemList[n].question;
			var c = itemList[n].choices;
			
			var qTEXT = document.createTextNode(q);
			
			// <!-- item wrapper -->
			$div_c_item = $('<div class="c-item"></div>');
			$div_item = $('<div class="item"></div>');	
			$h1_q = $('<h1 class="q"></h1>');
			$h1_q.append(qTEXT);
			
			$div_c_item.append($div_item);
			$div_item.append($h1_q);
		
			// choices
			for (z in c) {
				var aTEXT = document.createTextNode(c[z]);
				$div_a = $('<div class="a"></div>'); $div_a.append($(aTEXT));
				$div_item.append($div_a);
				
				if (z==1) {
					$div_item.append('<br/>');
				}
				
				// ANSWER CLICK
				$div_a.click(function(e){
					if (!complete) {
						var target = $(e.currentTarget).closest('.c-item').next();
						if (target.length > 0)
							$('body, html').delay(1000).animate({scrollTop:target.offset().top}, 1500);
						
						// color the selected answer and notSelected answer
						$(this).parent().find('div.a').each(function(){
							$(this).removeClass('selected').addClass('notSelected');
						});
						
						$(this).addClass('selected').removeClass('notSelected');
						
						if ($('.selected').length == question.length) {
							itemsAreAllAnswered = true;
							$('#finish_btn').addClass('sneak');
						} else {
							itemsAreAllAnswered = false;
							$('#finish_btn').removeClass('sneak');
						}
						
						// color according to correct/incorrect
						var guess = $(this).html();
						var currentQ = $(this).closest('.c-item').find('h1.q').html();
						
						// for (qq in question) {
							// if (question[qq][0]==currentQ) {
								// if (question[qq][1]==guess) {
									// $(this).addClass('correct');
								// } else $(this).addClass('incorrect');
							// }
						// }
						
						
						$(this).closest('.c-item').find('div.a').each(function(){
							for (qqq in question) {
								if (question[qqq][0]==currentQ) {
									if ($(this).html()==question[qqq][1]) $(this).addClass('correct').removeClass('notSelected'); // color green the correct answer
									else $(this).addClass('incorrect'); // color red the incorrect answer
								}
							}
							
							// make notice to the correct answer
							$('div.a.correct:not(.selected)').addClass('miniquake');
						});
						
						// calculate progress
						questionIndex++;
						
						updateProgress();
						
						$(this).off(); //remove click event
						$(this).closest('.c-item').find('div.a').off(); //remove click event
					} // end if (!complete)
				});
			}
			
			$('div#c-c-item').append($div_c_item);
			
			// the total question for the progress bar
			$('body').prepend($div_complete_nth.html(question.length)); 
			
		} // end for loop
		
		// ayusin para hindi patong patong ang mga .c-item
		$('.c-item').each(function(){
			var _top = parseInt($(this).index()) * screen.height;
			$(this).css('top', _top);
		});
	}
	
	// update progress
	updateProgress();
	function updateProgress() {
		// display the progress bar
		if ($('div#theBar').length == 0) {
			$('body').prepend($div_theBar);
			$div_theBar.after('<div id="theBar-shadow"></div>');
		}
		
		// display the nth (question/item counter)
		if ($('div#nth').length == 0) {
			$div_theBar.after($div_nth);
		}
		
		
		progress = Math.floor((questionIndex / question.length) * 100);
		
		// update progress
		$div_theBar.animate({width: progress+'%'}, 500);
		$div_nth.animate({left: (progress-1)+'%'}, 500).html(questionIndex);
		
		if (progress >= 100) $div_complete_nth.animate({top: '2.5%'}, 500);
		
		// check if complete progress
		if (questionIndex > question.length) {
			complete = true;
			$div_complete_nth.html('Complete');
		}
	}
	
	// FINISH CLICK
	var score
	$('#finish_btn').click(function(){
		$(this).off();
		score = 0;
		var nth = question.length;
		
		$('div.c-item').each(function(){
			var q = $(this).find('h1.q').html();
			var a = $(this).find('.selected').html();
			
			for (qq in question) {
				if (q==question[qq][0]) { 
					if (a==question[qq][1]) {
						score++;
					}
				}
			}
		});
		
		
		$('body').css({overflow: 'hidden'});
		itemsAreAllAnswered = false; // for restart
		$(this).addClass('curtain').css({
			height: $(window).height(),
		});
		
		var perfectHTML = score==question.length? '<span id="perfect_lbl">Perfect</span>' : '<span id="perfect_lbl">&nbsp;</span>';
		
		$(this).html($('<br/>' + perfectHTML).css('opacity','0').delay(1500).animate({opacity: '1'},1000));
		$(this)
			.append('<div class="result"><p><span class="score">'+score+'</span></p></div>')
			.append($('<div class="result"><a>out of</a> <b>'+nth+'</b> <a>items</a></div>').hide().delay(1000).fadeIn(1000))
			.append($(
				'<div id="buttons">\
					<div class="play_again_btn">Play again</div> &sdot; <div class="review_btn">Review</div>\
				</div>').hide().delay(1000).fadeIn(1000))
			.append($('<p id="mini-quiz-2014">Mini Quiz &#9786; 2014</p>').hide().delay(1000).fadeIn(1000));
		
		// PLAY AGAIN
		$('div.play_again_btn').click(function(){
			location.reload();
		});
	});
	
	// REVIEW
	$(document).on('click', 'div.review_btn', function(){
		$('#finish_btn').animate({top: '100%'}, 1000);
		setTimeout(function(){$('#finish_btn').remove();},5000);
		$div_theBar.remove();
		$div_complete_nth.remove();
		$div_nth.remove();
		$('div#theBar-shadow').remove();
		$('html, body').css('overflow','visible').scrollTop(0);
		
		// post nav
		$div_post_nav = $('<div id="post-nav"></div>'); //parent
		
		// children
		$div_correct = $('<div class="a correct" title="Correct">Correct</div>');
		$div_incorrect = $('<div class="a notSelected incorrect" title="Incorrect">Incorrect</div>');
		$div_mistakes = $('<div class="a incorrect selected" title="Mistakes">Mistakes</div>');
		
		// right children
		$div_total_n = $('<div id="total-n" class="a" title="Total items"></div>'); $div_total_n.html(question.length);
		$div_score = $('<div class="a" title="Score"></div>'); $div_score.html(score);
		$div_play = $('<div id="play" class="a">Play Again</div>');
		
		
		// play_btn
		$div_play_btn = $('<div id="play_btn" class="sneak">Play again</div>');
		$div_play_btn.click(function(){
			location.reload();
		});
		
		// play#2 btn
		$div_play.click(function(){
			location.reload();
		});
		
		
		$div_post_nav
			.append($div_correct)
			.append($div_incorrect)
			.append($div_mistakes)
			
			// right children
			.append($div_play)
			.append($div_total_n)
			.append($div_score);
		
		$('body').prepend($div_post_nav);
		$('body').append($div_play_btn);
	});
	
	
	function shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	
});