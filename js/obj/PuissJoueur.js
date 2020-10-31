var PuissJoueur = Obj.Extend(PuissObj, {

	statut : "player",
	name : "Default name",
	couleur: "jaune",
	has_played : false,

	__construct: function(name) {
		this.set(name);
	},
	set : function(name){
		this.name = name;
	},
	jouer : function(colonne){
		return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);
	}


}, "PuissJoueur");
