((window, document) => {
    /* NOTES:
       Creates a flash reading context in a fixed and centered
       position on the page. Background content is faded out 
       and a box appears with player options.
       
       Considerations:
       - Content awareness/intrusion
    */

    var contexts = [];
    var $B = (type, keys, fn) => {
	var res = document.createElement(type || "div");

	if (keys)
	    Object.keys(keys).map((k) => res[k] = keys[k]);
	
	if (fn)
	    fn(res);
	
	return res;
    };
    
    function Context() {
	var $ = this;
	var pref = {
	    speed: 200,
	    group: 1,
	};
	
	var el =
	    $B("div", { className: "pr_base" },
	       (base) => [
		   /**
		    * NAVIGATION BAR
		    */
		   $B("div", { className: "pr_nav" }, (e) => {
		       base.nav = e;
		       e.render = (state, current) => {
			   // Clear
			   e.innerHTML = "";
			   // TODO: Add title
			   current.nav
			   // Create each nav button
			       .map((page_id) =>
				    $B("div", { className: "pr_nav_button" },
				       (button) => {
					   button.innerHTML = "X";
					   button.onclick = function () {
					       state.history = [page_id].concat(state.history);
					       $.render();
					   }.bind({ page_id });
				       }))
			   // Add default back button
			       .concat(
				   $B("div", { className: "pr_nav_back" },
				      (button) => {
					  button.onclick = function() {
					      if (state.history.length > 1) {
						  state.history = state.history.slice(1);
						  $.render();
					      }
					  };
				      }))
			   // Add each button to nav bar
			       .map((b) => e.appendChild(b));
		       };
		   }),
		   
		   /**
		    * BODY SECTION
		    */
		   $B("div", { className: "pr_body" }, (e) => {
		       base.body = e;
		       e.render = (state, current) => {
			   e.innerHTML = "";
			   current.render(e);
		       };
		   }),	
       ].map((d) => base.appendChild(d)));
	
	var state = {
	    history: [0],
	    pages: [
		{
		    title: "Home",
		    icon: undefined,  // icon href
		    nav: [1],
		    render: (ctx) =>
			[
			    /**
			     * Current word for display
			     */
			    $B("div", { id: "pr_body_word" }, (word) => {
				word.innerHTML = state.src[state.i] || "";
			    }),
			    
			    /**
			     * Player
			     */
			    $B("div", { id: "pr_body_player" }, (player) => {
				[
				    $B("div", {
					id: "pr_body_button_prev",
					onclick: $.prev = () => console.log("prev"),
				    }),
				    $B("div", {
					id: "pr_body_button_play",
					onclick: $.play = () => {
					    state.last = Date.now();
					    state.playing = !state.playing;

					    $.render();
					},
				    }),
				    $B("div", {
					id: "pr_body_button_next",
					onclick: $.next = () => console.log("next"),
				    }),
				].map((e) => player.appendChild(e));	
			    }),
			].map((p) => ctx.appendChild(p)),
		},
		{
		    title: "Settings",
		    icon: undefined,  // icon href
		    nav: [],
		    render: (ctx) =>
			[
			    $B("input", {
				type: "range",
				min: 1,
				max: 1000,
				value: pref.speed
			    }, (speed) => {
				speed.oninput = () => {
				    pref.speed = speed.value;
				};
			    }),
			].map((p) => ctx.appendChild(p)),
		},
	    ],
	    src: [],
	    last: undefined,
	    i: 0,
	    playing: false,
	};

	$.render = () => {
	    var current = state.pages[state.history[0]] || {
		title: "ERROR",
		icon: undefined,
		nav: [],
		render: (ctx) => {
		    ctx.innerHTML = "ERROR: what even";
		}
	    };
	    el.nav.render(state, current);
	    el.body.render(state, current);
	};

	$.close = () => {
	    el.style.display = "none";
	};

	$.speed = pref.speed;

	$.read = (src) => {
	    state.src = [];
	    state.i = 0;
	    
	    src.map(
		(each) =>
		    each[Object.keys(each)[0]]
		    .split(/\s/)
		    .map((word) => state.src.push(word)));
	    
	    $.play();
	};

	window.setInterval(() => {
	    if (state.playing) {
		const now = Date.now();
		
		if (now - state.last >= 60*1000/pref.speed) {
		    ++state.i;

		    if (state.i > state.src.length)
			state.playing = false;
		    
		    state.last = now;

		    $.render();
		}
	    }
	}, 0);

	// Deploy
	$.render();
	document.body.appendChild(el);
    }
    
    window.Context = Context;
})
(
    window,
    document
);
