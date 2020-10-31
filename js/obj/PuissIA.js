var PuissIA = Obj.Extend(PuissObj, {

	statut : "IA",
	level : "",
	name : "Ordinateur",
	couleur: "rouge",
	has_played : false,
	grille_before : {
        1:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        2:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        3:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        4:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        5:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        6:{1:0,2:0,3:0,4:0,5:0,6:0,7:0}
    },

	__construct: function(level) {
		this.set(level);
	},
	set : function(level){
		this.level = level;
	},
	load_grille : function(){
		for( ligne in Plateau_de_jeu.grille){
            for ( colonne in Plateau_de_jeu.grille[ligne] ) {
                this.grille_before[ligne][colonne] = Plateau_de_jeu.grille[ligne][colonne];
            }
        }
	},
	jouerAlea : function(){

		var colonne =  Math.floor(Math.random() * 7) + 1;
				return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);

	},
	jouerIntell : function(){
		
		var colonne = 1;
		var gagne = null;
		var other_gagne = null;

		var colonne_where_play = null;
		var nb_pion_aligne = 0;

		// pour chaque colonne, on teste si on peut gagner
		while(colonne<=7 && gagne!=1){
			this.load_grille();
			gagne = Plateau_de_jeu.inserer_pion(this,colonne, this.grille_before, "TestVictoire");

			if(gagne!=1){
				colonne++;
			}
		}
		if(gagne==1){
			console.log("joue a la colonne "+colonne+" pour gagner");
			return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);
		}
		else{
			// sinon on teste si l'autre joueur peut gagner
			colonne= 1;
			while(colonne<=7 && other_gagne!=1){
				this.load_grille();
				other_gagne = Plateau_de_jeu.inserer_pion(Plateau_de_jeu.premier_joueur,colonne, this.grille_before, "TestBlocage");
			
				if(other_gagne!=1){
					colonne++;
				}
			}

			if(other_gagne==1){
				console.log("joue a la colonne " + colonne +" pour empecher le deuxieme joueur de gagner");
				return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);
			}
			else{
				// sinon on se place a l'endroit le plus avantageux

				colonne =  Math.floor(Math.random() * 7) + 1;
				return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);

				//colonne =  1;
/*
				while(colonne<=7){
					this.load_grille();

					nb_pion =  Plateau_de_jeu.inserer_pion(Plateau_de_jeu.premier_joueur,colonne, this.grille_before, "Avantage");
					if(nb_pion > nb_pion_aligne){
						nb_pion_aligne = nb_pion;
						colonne_where_play = colonne;
					}

					
					other_gagne = Plateau_de_jeu.inserer_pion(Plateau_de_jeu.premier_joueur,colonne, this.grille_before, "testIA");
				
					if(other_gagne!=1){
						colonne++;
					}
				}

				return Plateau_de_jeu.inserer_pion(this,colonne, Plateau_de_jeu.grille);*/
			}			
		}
	}

}, "PuissIA");