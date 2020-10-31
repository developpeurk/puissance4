/*!
* \class    WzObj
* \brief    Classe parente de toutes les autres classes de l'application
*/
var PuissObj =
	Obj.Extend({}, {

		domObjects: {},


		__contruct: function() {},

		toString: function() {
			return "TYPE: " + this.__className;
		},

		log: function() {
			console.log("Je log..." + this);
		}
	}, "WzObj");