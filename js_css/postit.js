var postNumber = 0;

var $pcolors;

var listcolors = {"amarillo":"#FEF1B5","azul":"#b5d6fe","verde":"#cefeb5","naranja":"#ffc36b","rosa":"#fab5fe"};

var canvas = {"myKanban":"mykanban.png", "dafo":"dafo.svg", "empatia":"empatia.png","cambas":"cambas.jpg"};

var canvasActive=null;

var canvaspostitIni=[
	  { "title":"init",
	  	"canvas":"ini.png",
	  	"date" : "01-02-2017",
		"postits":[
						{"id": 0, "px":300, "py":300, "tex":"primer posit", "col":"#b5d6fe"},
				  ]  	
		}
	];

var PostIt={

		new: function(){
			px=$(window).width()-300;
			obj={"id": postNumber , "px":px , "py":100, "tex" : "", "col":"#FEF1B5" }
			this.obj=obj;
			PostIt.draw(obj);
			PostIt.addData(obj);
			postNumber+=1;
		},

		draw: function(obj){
		
		    $("#tablero").append('<div class="post-it" id="'+obj.id+'" style="background-color: '+obj.col+'"><div class="header"><a href="#" class="opti">·</a><a href="#" class="close">X</a></div><div contenteditable="true" class="content">'+obj.tex+'</div></div>');

		    $("#"+obj.id).css({'top': obj.py, 'left': obj.px});
		    
		    $(".post-it").draggable({handle: ".header",stop: function() { 
			        	PostIt.changeData(PostIt.propierties(this.id).dindex,PostIt.propierties(this.id).dscreen);
			    }});
    	    
		    $("a.close").on("click", PostIt.delete);
		    $("a.opti").on("click", PostIt.showColor);

			$("#"+obj.id).on("focusout",function(){PostIt.changeData(PostIt.propierties(this.id).dindex,PostIt.propierties(this.id).dscreen);});
	    
		},

		delete: function(e){
		    var $parent = this.parentElement.parentElement;

			PostIt.deleteData($parent.id);		    
			//falta buscar el index del id
		    $parent.remove();
		    index=PostIt._findObjecData($parent.id);
		    PostIt.deleteData(index);

		},

		changeColor: function(e,c){
		    var $pc = e.target.parentElement.parentElement.parentElement;
		    $pit=$pc.parentElement;
			$($pit).css({'background-color':listcolors[c]});		    
			//falta buscar el index del id
		    $pc.remove();

		    PostIt.changeData(PostIt.propierties($pit.id).dindex,PostIt.propierties($pit.id).dscreen);

		},

		showColor: function(e){
			var $parent = this.parentElement.parentElement;
			$($parent).prepend($pcolors);
		},

		propierties:function(id){
			obj={}
				var e=document.getElementById(id);
				obj.dscreen={
					"id": id,
					"px": e.style.left,
					"py": e.style.top,
					"tex": e.querySelector(".content").innerHTML,
					"col": e.style.backgroundColor,
				}

			obj.dindex=PostIt._findObjecData(id);
			return obj;
		},
		
		addData:function(data){
			dat=canvaspostit[canvasActive].postits;
		    dat.push(data);
		    Board.update_localStorage();
		},

		changeData:function(index,data){
			dat=canvaspostit[canvasActive].postits;
		    dat.splice(index, 1, data);
		    Board.update_localStorage();

		},

		deleteData:function(index){

			dat=canvaspostit[canvasActive].postits;
		    dat.splice(index, 1);
		    Board.update_localStorage();
		},

		_findObjecData:function(value){
			dat=canvaspostit[canvasActive].postits;
			index=dat.findIndex(function(x){ return x.id==value});
			return index;
		}

};

var Board={

		initElement: function() {
			    dialog = $( "#dialog-form" ).dialog({
			      autoOpen: false,
			      height: 500,
			      width: 350,
			      modal: true,
			    });

			$("#btnNewProy").on( "click", function() {canvasActive=null; Board.showFormProyect(); });
			$("#btnEditProy").on( "click", function() { Board.showFormProyect(); });		
			
			canvaspostit=Board.read_localStorage();
			console.log("canvaspostit")			
			console.log(canvaspostit)

		    Board.createListMenu();
		    Board.createListCanva();
		    Board.createPanelColors();
			Board.draw();


			canvasActive=canvaspostit.length-1;
			Board.loadCanvas(canvasActive)
		
		},

		draw:function(){
			$("#tablero").append('<a href="#" id="btnOpenMenu"><img src="iicons/menu.png"></a>')
			$("#closeMenu").on("click", function(){	$("#menu").css({'margin-left': "-200px"}); $("#btnOpenMenu").css({'display': "block"})});
			$("#btnOpenMenu").on("click", function(){ $("#menu").css({'margin-left': "0px"}); $("#btnOpenMenu").css({'display': "none"})});

			$("#tablero").append('<a href="#" id="btnNewPostit"><img src="iicons/postits.png"></a>')			
			$("#btnNewPostit").on("click", PostIt.new);

		},

		read_localStorage:function(){
			//localStorage.canvaspostit="";
		    localStorage.canvaspostit = localStorage.canvaspostit || JSON.stringify(canvaspostitIni);
		    return JSON.parse(localStorage.canvaspostit);
		},

		update_localStorage:function(){
			localStorage.canvaspostit = JSON.stringify(canvaspostit);
		},
	
		confirmFormProyect:function(){
			if(canvasActive){
				Board.updateProyect();
			}else{
				Board.addProyect();				
			}
		},

		addProyect:function(){
			var h = new Date();
			var hoy = h.getDate()+"-"+(h.getMonth()+1)+"-"+h.getFullYear();

			obj={
				"title": $('#newProy').val(),
			  	"canvas":$('#listcanvas').val(),
	  			"date" : hoy,
				"postits":[]
			};
			console.log("nuevo p")
			console.log(obj)
			canvaspostit.push(obj);
			canvasActive=canvaspostit.length-1;
			dialog.dialog( "close" );
			Board.createListMenu();
			Board.update_localStorage();

			Board.loadCanvas(canvaspostit.length-1)
		},

		delProyect:function(){
			dat=canvaspostit;
		    dat.splice(canvasActive, 1);

		    dialog.dialog( "close" );
		    Board.createListMenu();
			Board.update_localStorage();

			Board.loadCanvas(canvaspostit.length)		    
		},
		updateProyect:function(){
			dat=canvaspostit;
			obj={
				"title": $('#newProy').val(),
			  	"canvas":$('#listcanvas').val(),
	  			"date" : canvaspostit[canvasActive].date,
				"postits":canvaspostit[canvasActive].postits
			};

		    dat.splice(canvasActive, 1,obj);
		    dialog.dialog( "close" );
		    Board.createListMenu();
			Board.update_localStorage();
			Board.loadCanvas(canvasActive)

		},		
		showFormProyect:function(){

			dialog.dialog( "open" );
			if(canvasActive){
				titl=canvaspostit[canvasActive].title;
				vcanva=canvaspostit[canvasActive].canvas;
			}else{
				titl="";
				vcanva="mykanban.png"
			}
			$("#newProy").val(titl);	
			$("#listcanvas").val(vcanva);
			$("#imgPre").attr("src","canvas/"+vcanva)					
			dialog.dialog( "open" );
		},

		createListMenu:function(){
			data=canvaspostit;
			$("#listmenu").html("");
			var ldata="";
			for(var d=(data.length-1); d>0 ; d--) {
			    ldata+='<li><a href="#" onclick="Board.loadCanvas('+d+')">'+data[d].title+'</a></li>'
			}
			$("#listmenu").append(ldata);
		},

		createListCanva:function(){
			var ldata="";
			for(var d in canvas) {
	   
			    ldata+='<option value="'+canvas[d]+'">'+d+'</option>'
			}
			$("#listcanvas").append(ldata);
			$("#listcanvas").on("change", function(){ $("#imgPre").attr("src","canvas/"+$("#listcanvas").val()) });
		},

		createPanelColors:function(){
			var div = $("<div/>",{ id : "pcolors"});
			var ul = $("<ul/>",{ id : "colors" });

			for(var d in listcolors) {
					li = $("<li/>"),
					a = $("<a/>",{
					  href: "#",
					  style: 'background-color:'+listcolors[d],
					  onclick:"PostIt.changeColor(event,'"+d+"')"
					});
					a.appendTo(li)
					li.appendTo(ul);
			}		
			ul.appendTo(div);
			$pcolors=div;
			
		},

		loadCanvas:function(id){

			$("#tablero").html("");
			Board.draw();
			var lastid=0;
			canvasActive=id;
			console.log("carga:"+id);
			d=canvaspostit[id];
			$("#tablero").css({'background': "url(canvas/"+d.canvas+") 100% 100%"});
				for(var p in d.postits) {
						PostIt.draw(d.postits[p])
						lastid=d.postits[p].id;
				}
			postNumber = lastid+1;

			$("#listmenu>li>a.active").removeClass("active");
			$element=$("#listmenu>li:nth-child("+(canvaspostit.length-canvasActive)+")>a");
			
			$element.addClass("active");
		}

};



$(function() {
	Board.initElement();
});
