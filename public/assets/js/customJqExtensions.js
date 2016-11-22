

 $.extend({
        distinctObj:function(obj,propertyName) {
            var result = [];
            $.each(obj,function(i,v){
                var prop=eval("v."+propertyName);
                if ($.inArray(prop, result) == -1) result.push(prop);
            });
            return result;
        }
    });
 