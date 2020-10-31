/*!
 * \class    Plateau_de_jeu
 */
Plateau_de_jeu = {

    grille : {
        1:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        2:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        3:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        4:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        5:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},
        6:{1:0,2:0,3:0,4:0,5:0,6:0,7:0}
    },

    premier_joueur : null,
    deuxieme_joueur : null,
    player: null,

    IA: null,

    has_played : false,
    last_colonne : 0,

    /**
     * Affiche la grille et gere les changement de tour entre les deux joueurs.
     *  On y trouve également l'evenement de clic sur les cases de la grille.
     *
     * @param   joueur   Le joueur dont c'est le tour de jouer.
    */

    affiche : function(joueur,statut)
    {
        var gagne = 0;
        var colonne_accept = 2;
        $(".enregistrerJoueurs").html("");

        Render.render("./view/joueur.twig.html",{name:joueur.name},
            function(html){
            $("#joueurs_turn").html("");
            $("#joueurs_turn").append($(html));
        });
        
        Render.render("./view/grille.twig.html",{
            grille_jeu: Plateau_de_jeu.grille
        },function(html){

            if(joueur.statut=="player" ){
                $(html).find(".case").click(function(e){

                    colonne_accept = joueur.jouer($(this).data("colonne"));

                        if(colonne_accept!=2 && colonne_accept!=1){
                            joueur.has_played=true;    // le pion a bien été inseré donc le joueur a joué
                            if(joueur.has_played==true){
                                joueur.has_played=false;
                                    if(joueur.couleur == "jaune"){
                                        if(Plateau_de_jeu.deuxieme_joueur == null){
                                            Plateau_de_jeu.affiche(Plateau_de_jeu.IA);
                                        }
                                        else{
                                            Plateau_de_jeu.affiche(Plateau_de_jeu.deuxieme_joueur);
                                        }                  
                                    }
                                    else{
                                        Plateau_de_jeu.affiche(Plateau_de_jeu.premier_joueur);
                                    }
                            }                
                        }
                }); 
            }

            $("#grille").html("");
            $("#grille").append($(html));

            if(colonne_accept !=1){
                if(joueur.statut=="IA" && statut!="end"){
                    setTimeout(function(){

                        if(joueur.level == "aleatoire"){
                            colonne_accept = joueur.jouerAlea($(this).data("colonne"));
                        }
                        else if(joueur.level == "intelligente"){
                            colonne_accept = joueur.jouerIntell($(this).data("colonne"));
                        }
                        else{
                            colonne_accept = joueur.jouerBloq($(this).data("colonne"));
                        }                       

                    while(colonne_accept==2){
                        if(joueur.level == "aleatoire"){
                            colonne_accept = joueur.jouerAlea($(this).data("colonne"));
                        }
                        else if(joueur.level == "intelligente"){
                            colonne_accept = joueur.jouerIntell($(this).data("colonne"));
                        }
                        else{
                            colonne_accept = joueur.jouerBloq($(this).data("colonne"));
                        }   
                    }
                    
                    colonne_accept=2;
                    Plateau_de_jeu.affiche(Plateau_de_jeu.premier_joueur);
                    },1500);
                }
            }
        });
    },
    /**
     *  Affiche la box qui permet d'annoncer la victoire d'un joueur, de rejouer la partie, ou de changer de joueur/IA.
     *
     * @param   joueur   Le joueur qui a gagner.
    */
    affiche_victoire : function(joueur)
    {
        Plateau_de_jeu.affiche(joueur,"end");
        $("body").toggleClass("victory");

        if(Plateau_de_jeu.deuxieme_joueur==null){ // on joue contre une IA
            Render.render("./view/victory.ia.twig.html",{name:joueur.name},function(html){

                $(html).find("#restart").click(function(evt){
                    evt.preventDefault();
                    Plateau_de_jeu.rejouer();
                });
                $(".victoire").append($(html));
            }); 
        }else{ // on joue contre un joueur
            Render.render("./view/victory.twig.html",{name:joueur.name},function(html){

                $(html).find("#restart").click(function(evt){
                    evt.preventDefault();
                    Plateau_de_jeu.rejouer();
                });
                $(".victoire").append($(html));
            });              
        }
    },
    affiche_match_nul : function(joueur)
    {
        Plateau_de_jeu.affiche(joueur,"end");
        $("body").toggleClass("victory");

        Render.render("./view/ex_eaquo.twig.html",{},function(html){

            $(html).find("#restart").click(function(evt){
                evt.preventDefault();
                Plateau_de_jeu.rejouer();
            });
            $(".victoire").append($(html));
        });
    },
    test_grille_pleine : function(){
        var pleine = true;
        
        for( ligne in Plateau_de_jeu.grille){
            for ( colonne in Plateau_de_jeu.grille[ligne] ) {
               if(Plateau_de_jeu.grille[ligne][colonne] == 0){
                pleine = false;
               }
            }
        } 

        return pleine;  
    },
    /**
     *  Créer deux objets joueurs et attribut la couleur rouge au second puis lance la partie.
     *
     * @param   nameJ1   Nom du premier joueur.
     * @param   nameJ2   Nom du second joueur.
    */
    initialise_player_vs_player : function(nameJ1, nameJ2)
    {
        Plateau_de_jeu.premier_joueur = new PuissJoueur(nameJ1);
        Plateau_de_jeu.deuxieme_joueur = new PuissJoueur(nameJ2);
        Plateau_de_jeu.deuxieme_joueur.couleur = "rouge";

        Plateau_de_jeu.partie();
    },
    /**
     *  Créer un objet joueur et un objet IA puis lance la partie.
     *
     * @param   nameJ1   Nom du premier joueur.
     * @param   levelIA  Façon dont va joueur l'IA.
    */
    initialise_player_vs_ia : function(nameJ1,levelIA)
    {

        Plateau_de_jeu.premier_joueur = new PuissJoueur(nameJ1);
        Plateau_de_jeu.IA = new PuissIA(levelIA);

        Plateau_de_jeu.partie();
    },
    /**
     *  On inserer le jeton dans la colonne sélectionnée puis on teste si cela forme une ligne
     *  de 4 jetons en faveur du joueur qui a joué. Affiche le bloc de victoire si c'est le cas.
     *  Renvoie aussi la colonne joué dans la variable @Plateau_de_jeu.last_colonne
     *
     * @param   joueur   Le joueur qui joue.
     * @param   colonne  Colonne ou inserer le jeton.
     * @return  number   2 si la colonne est pleine, 1 si le joueur a gagné et 0 sinon.
    */
    inserer_pion : function(joueur, colonne, grille, statut)
    {
        var gagne = false;
        var empty = true;
        var ligne = 6;

        while(empty== true){
            if(ligne<1){return 2; /*Colonne complete*/}
            else{

                Plateau_de_jeu.last_colonne = colonne;

                if (grille[ligne][colonne] == 0){
                    empty = false;
                    grille[ligne][colonne] = joueur.couleur;
                }
                else{ligne-=1;}
            }
        }

        gagne = Plateau_de_jeu.test_ligne(joueur.couleur,ligne, colonne, grille);

        if(gagne != 1){
            if(ligne<=3){
               gagne =  Plateau_de_jeu.test_colonne(joueur.couleur,ligne, colonne, grille);
            }
            if(gagne!=1){
                gagne = Plateau_de_jeu.test_diago(joueur.couleur,ligne, colonne, grille);
                if(gagne==1){
                    console.log("par diago");$
                    if(!statut){
                        Plateau_de_jeu.affiche_victoire(joueur);
                    }
                    return gagne;                     
                }
                else{// pas 4 jetons alignés
                    if(Plateau_de_jeu.test_grille_pleine() == false){
                        return 0;
                    }
                    else{
                        Plateau_de_jeu.affiche_match_nul(joueur);
                        return -1;
                    }
                }
            }
            else{
                console.log("par colonne");
                if(!statut){
                        Plateau_de_jeu.affiche_victoire(joueur);
                }
                return gagne; 
            }
        }
        else{
            console.log("par ligne");
            if(!statut){
                        Plateau_de_jeu.affiche_victoire(joueur);
            } 
            return gagne;     
        }
    },
    /**
     *  On compte le nombre de pion de la couleur @couleur_joueur a droite de la case dans laquelle
     *  le joueur vient d'inséré son jeton. Si c'est 4 on retourne 1 sinon on y ajoute celles de gauche
     *  et on retourne 4 si il y a 4 pion d'alignés sinon 0.
     *
     * @param   couleur_joueur   La couleur du joueur qui vient de jouer.
     * @param   colonne          Colonne ou le jeton a été inseré.
     * @param   ligne            Ligne ou le jeton a été inseré.
     * @return  number           Retourne 1 si 4 pions d'alignés sinon 0.
    */
    test_ligne : function(couleur_joueur, ligne, colonne, grille)
    {
        nb_pion_aligne = 1;
        aligne = true;
        c = colonne +1;
        while (aligne && c<=7 && nb_pion_aligne <4){ // test droite
            if (grille[ligne][c] == couleur_joueur){
                nb_pion_aligne+=1;
                c+=1;
            }
            else{aligne = false;}
        }
        if(nb_pion_aligne==4){return 1;}
        else{ //test gauche
            aligne= true;
            c=colonne-1;
            while(aligne && c>=1 && nb_pion_aligne<4){
                if (grille[ligne][c] == couleur_joueur){
                    nb_pion_aligne+=1;
                    c-=1;
                }
                else{aligne = false;}                
            }
            if(nb_pion_aligne == 4){return 1;}
            else{return 0;}
        }
    },
    /**
     *  On regarde si les 3 cases en dessous de la case dans laquelle le joueur vient d'inséré 
     *  son jeton sont de la même couleur que @couleur_joueur.
     *
     * @param   couleur_joueur   La couleur du joueur qui vient de jouer.
     * @param   colonne          Colonne ou le jeton a été inseré.
     * @param   ligne            Ligne ou le jeton a été inseré.
     * @return  number           Retourne 1 si 4 pions d'alignés sinon 0.
    */
    test_colonne : function(couleur_joueur, ligne, colonne, grille)
    {
        if(grille[ligne+1][colonne] == couleur_joueur && grille[ligne+2][colonne] == couleur_joueur && grille[ligne+3][colonne] == couleur_joueur){
            return 1 ;
        }
        else{return 0;}
    },
    /**
     *  On compte le nombre de pion qui se trouve dans la diagonale haut droite de la case choisie,
     *  si il y en a 4 on retourne 1, sinon on compte le nombre de pion qui se trouve dans la diagonale
     *  bas gauche, si il y en a 4 on retourne 1, sinon On compte le nombre de pion qui se trouve dans 
     *  la diagonale bas droite de la case choisie, si il y en a 4 on retourne 1, sinon on compte le 
     *  nombre de pion qui se trouve dans la diagonale haut gauche, si il y en a 4 on retourne 1 sino 0.
     *
     * @param   couleur_joueur   La couleur du joueur qui vient de jouer.
     * @param   colonne          Colonne ou le jeton a été inseré.
     * @param   ligne            Ligne ou le jeton a été inseré.
     * @return  number           Retourne 1 si 4 pions d'alignés sinon 0.
    */
    test_diago: function(couleur_joueur, ligne, colonne, grille)
    {
     // test diago haut droite bas gauche
        //on va vers diago haut droite
        nb_pion_aligne = 1;
        aligne = true;
        c = colonne +1;
        l = ligne - 1;

        while(aligne && c<=7 && l >= 1 && nb_pion_aligne<4){
            if (grille[l][c] == couleur_joueur){
                nb_pion_aligne+=1;
                c+=1;
                l-=1;
            }
            else{aligne = false;}            
        }
        if(nb_pion_aligne==4){return 1;}
        else{// on va vers diago bas gauche
            aligne = true;
            c= colonne-1;
            l= ligne+1;
            while(aligne && c>=1 && l <=6 && nb_pion_aligne<4){
                if (grille[l][c] == couleur_joueur){
                    nb_pion_aligne+=1;
                    c-=1;
                    l+=1;
                }
                else{aligne = false;}  
            }
            if(nb_pion_aligne==4){return 1;}
            else{
     // test diago bas droite haut gauche
                // on va vers diago bas droite
                aligne = true;
                nb_pion_aligne = 1;
                c = colonne+1;
                l = ligne +1;

                while(aligne && c<=7 && l <= 6 && nb_pion_aligne<4){
                    if (grille[l][c] == couleur_joueur){
                        nb_pion_aligne+=1;
                        c+=1;
                        l+=1;
                    }
                    else{aligne = false;}            
                }
                if(nb_pion_aligne==4){return 1;}
                else{// on va vers diago haut gauche
                    aligne = true;
                    c= colonne-1;
                    l= ligne-1;
                    while(aligne && c>= 1 && l >=1 && nb_pion_aligne<4){
                        if (grille[l][c] == couleur_joueur){
                            nb_pion_aligne+=1;
                            c-=1;
                            l-=1;
                        }
                        else{aligne = false;}              
                    }
                    if(nb_pion_aligne==4){return 1;}
                    else{ return 0 ;}
                }
            }
        }
    },
    /**
     *  Par un random on "choisi" le joueur qui va commencer la partie. Puis on affiche la grille.
    */
    partie: function()
    {
        var starter = Math.floor( Math.random() * 2 )+1 ;
        if (starter==1) {
            Plateau_de_jeu.player = Plateau_de_jeu.premier_joueur;
        }
        else{ 
            if(Plateau_de_jeu.deuxieme_joueur==null){
                Plateau_de_jeu.player = Plateau_de_jeu.IA;
            }
            else{
                Plateau_de_jeu.player = Plateau_de_jeu.deuxieme_joueur;
            }
        }
        Plateau_de_jeu.affiche(Plateau_de_jeu.player);
    },
    /**
     *  Efface la bloc d'annonce de la victoire. Parcours la grille et reinitialise toutes les valeurs
     *  quelle contient à 0. Puis (re)lance la partie.
    */
    rejouer: function()
    {
        $("body").toggleClass("victory");
        $(".victoire").html("");

        for( ligne in Plateau_de_jeu.grille){
            for ( colonne in Plateau_de_jeu.grille[ligne] ) {
                Plateau_de_jeu.grille[ligne][colonne] = 0;
            }
        }
        Plateau_de_jeu.partie();
    }

};