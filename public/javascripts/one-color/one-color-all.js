(function(a,b,c,d,e,f,g){function m(){var a=this.rgb(),b=a._red*.3+a._green*.59+a._blue*.11;return new l.RGB(b,b,b,this._alpha)}typeof one=="undefined"&&(one={include:function(){}});var h=[],i=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,j=/\s*(\.\d+|\d+(?:\.\d+)?)\s*/,k=new RegExp("^(rgb|hsl|hsv)a?\\("+i.source+","+i.source+","+i.source+"(?:,"+j.source+")?"+"\\)$","i"),l=one.color=function(a){if(Object.prototype.toString.apply(a)==="[object Array]")return a[0].length===4?new l.RGB(a[0]/255,a[1]/255,a[2]/255,a[3]/255):new l[a[0]](a.slice(1,a.length));if(a.charCodeAt){if(l.namedColors){var e=a.toLowerCase();l.namedColors[e]&&(a=l.namedColors[e])}var f=a.match(k);if(f){var g=f[1].toUpperCase(),h=typeof f[8]=="undefined"?f[8]:b(f[8]),i=g[0]==="H",j=f[3]?100:i?360:255,m=f[5]||i?100:255,n=f[7]||i?100:255;if(typeof l[g]=="undefined")throw new Error("one.color."+g+" is not installed.");return new l[g](b(f[2])/j,b(f[4])/m,b(f[6])/n,h)}a.length<6&&(a=a.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var o=a.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(o)return new l.RGB(c(o[1],16)/255,c(o[2],16)/255,c(o[3],16)/255)}else{if(typeof a=="object"&&a.isColor)return a;if(!d(a))return new l.RGB((a&255)/255,((a&65280)>>8)/255,((a&16711680)>>16)/255)}return!1};l.installColorSpace=function(b,c,d){function j(b,c){var d={};d[c.toLowerCase()]=new a("return this.rgb()."+c.toLowerCase()+"();"),l[c].propertyNames.forEach(function(b,e){d[b]=new a("value","isDelta","return this."+c.toLowerCase()+"()."+b+"(value, isDelta);")});for(var e in d)d.hasOwnProperty(e)&&l[b].prototype[e]===undefined&&(l[b].prototype[e]=d[e])}l[b]=new a(c.join(","),"if (Object.prototype.toString.apply("+c[0]+") === '[object Array]') {"+c.map(function(a,b){return a+"="+c[0]+"["+b+"];"}).reverse().join("")+"}"+"if ("+c.filter(function(a){return a!=="alpha"}).map(function(a){return"isNaN("+a+")"}).join("||")+"){"+'throw new Error("[one.color.'+b+']: Invalid color: ("+'+c.join('+","+')+'+")");}'+c.map(function(a){return a==="hue"?"this._hue=hue<0?hue-Math.floor(hue):hue%1":a==="alpha"?"this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);":"this._"+a+"="+a+"<0?0:("+a+">1?1:"+a+")"}).join(";")+";"),l[b].propertyNames=c;var f=l[b].prototype;["valueOf","hex","css","cssa"].forEach(function(c){f[c]=f[c]||(b==="RGB"?f.hex:new a("return this.rgb()."+c+"();"))}),f.isColor=!0,f.equals=function(a,d){typeof d=="undefined"&&(d=1e-10),a=a[b.toLowerCase()]();for(var f=0;f<c.length;f+=1)if(e.abs(this["_"+c[f]]-a["_"+c[f]])>d)return!1;return!0},f.toJSON=new a("return ['"+b+"', "+c.map(function(a){return"this._"+a},this).join(", ")+"];");for(var g in d)if(d.hasOwnProperty(g)){var i=g.match(/^from(.*)$/);i?l[i[1].toUpperCase()].prototype[b.toLowerCase()]=d[g]:f[g]=d[g]}f[b.toLowerCase()]=function(){return this},f.toString=new a('return "[one.color.'+b+':"+'+c.map(function(a,b){return'" '+c[b]+'="+this._'+a}).join("+")+'+"]";'),c.forEach(function(b,d){f[b]=new a("value","isDelta","if (typeof value === 'undefined') {return this._"+b+";"+"}"+"if (isDelta) {"+"return new this.constructor("+c.map(function(a,c){return"this._"+a+(b===a?"+value":"")}).join(", ")+");"+"}"+"return new this.constructor("+c.map(function(a,c){return b===a?"value":"this._"+a}).join(", ")+");")}),h.forEach(function(a){j(b,a),j(a,b)}),h.push(b)},l.installMethod=function(a,b){h.forEach(function(c){l[c].prototype[a]=b})},l.installColorSpace("RGB",["red","green","blue","alpha"],{hex:function(){var a=(f(255*this._red)*65536+f(255*this._green)*256+f(255*this._blue)).toString(16);return"#"+"00000".substr(0,6-a.length)+a},css:function(){return"rgb("+f(255*this._red)+","+f(255*this._green)+","+f(255*this._blue)+")"},cssa:function(){return"rgba("+f(255*this._red)+","+f(255*this._green)+","+f(255*this._blue)+","+this._alpha+")"}}),l.installColorSpace("HSV",["hue","saturation","value","alpha"],{rgb:function(){var a=this._hue,b=this._saturation,c=this._value,d=g(5,e.floor(a*6)),f=a*6-d,h=c*(1-b),i=c*(1-f*b),j=c*(1-(1-f)*b),k,m,n;switch(d){case 0:k=c,m=j,n=h;break;case 1:k=i,m=c,n=h;break;case 2:k=h,m=c,n=j;break;case 3:k=h,m=i,n=c;break;case 4:k=j,m=h,n=c;break;case 5:k=c,m=h,n=i}return new l.RGB(k,m,n,this._alpha)},hsl:function(){var a=(2-this._saturation)*this._value,b=this._saturation*this._value,c=a<=1?a:2-a,d;return c<1e-9?d=0:d=b/c,new l.HSL(this._hue,d,a/2,this._alpha)},fromRgb:function(){var a=this._red,b=this._green,c=this._blue,d=e.max(a,b,c),f=g(a,b,c),h=d-f,i,j=d===0?0:h/d,k=d;if(h===0)i=0;else switch(d){case a:i=(b-c)/h/6+(b<c?1:0);break;case b:i=(c-a)/h/6+1/3;break;case c:i=(a-b)/h/6+2/3}return new l.HSV(i,j,k,this._alpha)}}),l.installColorSpace("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var a=this._lightness*2,b=this._saturation*(a<=1?a:2-a),c;return a+b<1e-9?c=0:c=2*b/(a+b),new l.HSV(this._hue,c,(a+b)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}}),l.installColorSpace("CMYK",["cyan","magenta","yellow","black","alpha"],{rgb:function(){return new l.RGB(1-this._cyan*(1-this._black)-this._black,1-this._magenta*(1-this._black)-this._black,1-this._yellow*(1-this._black)-this._black,this._alpha)},fromRgb:function(){var a=this._red,b=this._green,c=this._blue,d=1-a,e=1-b,f=1-c,h=1;return a||b||c?(h=g(d,g(e,f)),d=(d-h)/(1-h),e=(e-h)/(1-h),f=(f-h)/(1-h)):h=1,new l.CMYK(d,e,f,h,this._alpha)}}),l.namedColors={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},l.installMethod("clearer",function(a){return a=d(a)?.1:a,this.alpha(-a,!0)}),l.installMethod("darken",function(a){return a=d(a)?.1:a,this.lightness(-a,!0)}),l.installMethod("saturate",function(a){return a=d(a)?.1:a,this.saturation(-a,!0)}),l.installMethod("greyscale",m),l.installMethod("grayscale",m),l.installMethod("lighten",function(a){return a=d(a)?.1:a,this.lightness(a,!0)}),l.installMethod("mix",function(a,b){var a=l(a),b=1-(b||.5),c=b*2-1,d=this._alpha-a._alpha,e=((c*d==-1?c:(c+d)/(1+c*d))+1)/2,f=1-e,g=this.rgb(),a=a.rgb();return new l.RGB(this._red*e+a._red*f,this._green*e+a._green*f,this._blue*e+a._blue*f,this._alpha*b+a._alpha*(1-b))}),l.installMethod("negate",function(){var a=this.rgb();return new l.RGB(1-a._red,1-a._green,1-a._blue,this._alpha)}),l.installMethod("opaquer",function(a){return a=d(a)?.1:a,this.alpha(a,!0)}),l.installMethod("rotate",function(a){return amount=(a||0)/360,this.hue(amount,!0)}),l.installMethod("saturate",function(a){return a=d(a)?.1:a,this.saturation(a,!0)}),l.installMethod("toAlpha",function(a){var b=this.rgb(),c=l(a).rgb(),d=1e-10,e=new l.RGB(0,0,0,b._alpha),f=["_red","_green","_blue"];return f.forEach(function(a){b[a]<d?e[a]=b[a]:b[a]>c[a]?e[a]=(b[a]-c[a])/(1-c[a]):b[a]>c[a]?e[a]=(c[a]-b[a])/c[a]:e[a]=0}),e._red>e._green?e._red>e._blue?b._alpha=e._red:b._alpha=e._blue:e._green>e._blue?b._alpha=e._green:b._alpha=e._blue,b._alpha<d?b:(f.foreach(function(a){b[a]=(b[a]-c[a])/b._alpha+c[a]}),b._alpha*=e._alpha,b)}),typeof module!="undefined"&&(module.exports=l)})(Function,parseFloat,parseInt,isNaN,Math,Math.round,Math.min)
