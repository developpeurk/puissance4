$('document').ready(function() {

	$("#launcher").click(function(evt){
		evt.preventDefault();
		Plateau_de_jeu.initialise_player_vs_player($("#joueur1").val(),$("#joueur2").val());
	});

	$("#launcher_IA").click(function(evt){
		evt.preventDefault();
 		Plateau_de_jeu.initialise_player_vs_ia($("#joueur1").val(),$("#levelIA").val());
 	});	


});