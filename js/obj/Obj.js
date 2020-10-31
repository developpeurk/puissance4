var Obj={
    Extend:function(parent,obj,className){
        var child=function(){
            __self=this;
            this.__super=parent.prototype;
            if (!className)className="Obj";
            this.__className=className;

            /*** Call constructor ***/
            var hasArgs=0;
            var funcToEval="this.__construct(";
            for (i=0;i<arguments.length;i++){
                funcToEval+="arguments["+i+"],";
                hasArgs=1;
            }
            if (hasArgs)
                funcToEval=funcToEval.substring(0,funcToEval.length-1);
            funcToEval+=");";

            eval(funcToEval);
        };

        function Obj() {
            this.constructor = child;
        }
        Obj.prototype = parent.prototype;
        child.prototype = new Obj();
        $.extend(child.prototype,$.extend(parent.prototype,obj));
        return child;
    }
}
