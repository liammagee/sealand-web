one.color
=========

JavaScript color calculation toolkit for node.js and the browser.

* RGB, HSV, HSL, and CMYK colorspace support (experimental implementations of LAB and XYZ)
* Legal values for all channels are 0..1
* Instances are immutable -- a new object is created for each manipulation
* All internal calculations are done using floating point, so very little precision is lost due to rounding errors when converting between colorspaces
* Alpha channel support
* Extensible architecture -- implement your own colorspaces easily
* Chainable color manipulation
* Seamless conversion between colorspaces
* Outputs as hex, `rgb(...)`, `rgba(...)` or `hsv(...)`


Usage
-----

In the browser (change `one-color.js` to `one-color-all.js` to gain
named color support):

    <script src='one-color.js'></script>
    <script>
        alert('Hello, ' + one.color('#650042').lightness(.3).green(.4).hex() + ' world!');
    </script>

In node.js (after `npm install onecolor`):

    var color = require('onecolor');
    console.warn(color('rgba(100%, 0%, 0%, .5)').alpha(.4).cssa()); // 'rgba(255,0,0,0.4)'

`one.color` is the parser. All of the above return color instances in
the relevant color space with the channel values (0..1) as instance
variables:

    var myColor = one.color('#a9d91d');
    myColor instanceof one.color.RGB; // true
    myColor.red() // 0.6627450980392157

You can also parse named CSS colors (works out of the box in node.js,
but the requires the slightly bigger `one-color-all.js` build in the
browser):

    one.color('maroon').lightness(.3).hex() // '#990000'

To turn a color instance back into a string, use the `hex()`, `css()`,
and `cssa()` methods:

    one.color('rgb(124, 96, 200)').hex() // '#7c60c8'
    one.color('#bb7b81').cssa() // 'rgba(187,123,129,1)'

Color instances have getters/setters for all channels in all supported
colorspaces (`red()`, `green()`, `blue()`, `hue()`, `saturation()`, `lightness()`,
`value()`, `alpha()`). Thus you don't need to think about which colorspace
you're in. All the necessary conversions happen automatically:

    one.color('#ff0000') // Red in RGB
        .green(1) // Set green to the max value, producing yellow (still RGB)
        .hue(.5, true) // Add 180 degrees to the hue, implicitly converting to HSV
        .hex() // Dump as RGB hex syntax: '#2222ff'

When called without any arguments, they return the current value of
the channel (0..1):

    one.color('#09ffdd').green() // 1
    one.color('#09ffdd').saturation() // 0.9647058823529412

When called with a single numerical argument (0..1), a new color
object is returned with that channel replaced:

    var myColor = one.color('#00ddff');
    myColor.red(.5).red() // .5

    // ... but as the objects are immutable, the original object retains its value:
    myColor.red() // 0

When called with a single numerical argument (0..1) and `true` as
the second argument, a new value is returned with that channel
adjusted:

    one.color('#ff0000') // Red
        .red(-.1, true) // Adjust red channel by -0.1
        .hex() // '#e60000'


Alpha channel
-------------

All color instances have an alpha channel (0..1), defaulting to 1
(opaque). You can simply ignore it if you don't need it.

It's preserved when converting between colorspaces:

    one.color('rgba(10, 20, 30, .8)')
        .green(.4)
        .saturation(.2)
        .alpha() // 0.8


Comparing color objects
-----------------------

If you need to know if two colors represent the same 8 bit color, regardless
of colorspace, compare their `hex()` values:

    one.color('#f00').hex() === one.color('#e00').red(1).hex() // true

Use the `equals` method to compare two color instances within a certain
epsilon (defaults to `1e-9`):

    one.color('#e00').lightness(.00001, true).equals(one.color('#e00'), 1e-5) // false
    one.color('#e00').lightness(.000001, true).equals(one.color('#e00'), 1e-5) // true


API overview
============

Color parser function, the recommended way to create a color instance:

    one.color('#a9d91d') // Regular hex syntax
    one.color('#eee') // Short hex syntax
    one.color('rgb(124, 96, 200)') // CSS rgb syntax
    one.color('rgb(99%, 40%, 0%)') // CSS rgb syntax with percentages
    one.color('rgba(124, 96, 200, .4)') // CSS rgba syntax
    one.color('hsl(120, 75%, 75%)') // CSS hsl syntax
    one.color('hsla(120, 75%, 75%, .1)') // CSS hsla syntax
    one.color('hsv(220, 47%, 12%)') // CSS hsv syntax (non-standard)
    one.color('hsva(120, 75%, 75%, 0)') // CSS hsva syntax (non-standard)
    one.color([0, 4, 255, 120]) // CanvasPixelArray entry, RGBA
    one.color(["RGB", .5, .1, .6, .9]) // The output format of color.toJSON()

The slightly bigger `one-color-add.js` build adds support for
<a href='http://en.wikipedia.org/wiki/Web_colors'>the standard suite of named CSS colors</a>:

    one.color('maroon')
    one.color('darkolivegreen')

Existing one.color instances pass through unchanged, which is useful
in APIs where you want to accept either a string or a color instance:

    one.color(one.color('#fff')) // Same as one.color('#fff')

Serialization methods:

    color.hex() // 6-digit hex string: '#bda65b'
    color.css() // CSS rgb syntax: 'rgb(10,128,220)'
    color.cssa() // CSS rgba syntax: 'rgba(10,128,220,0.8)'
    color.toString() // For debugging: '[one.color.RGB: Red=0.3 Green=0.8 Blue=0 Alpha=1]'
    color.toJSON() // ["RGB"|"HSV"|"HSL", <number>, <number>, <number>, <number>]

Getters -- return the value of the channel (converts to other colorspaces as needed):

    color.red()
    color.green()
    color.blue()
    color.hue()
    color.saturation()
    color.value()
    color.lightness()
    color.alpha()
    color.cyan()    // one-color-all.js and node.js only
    color.magenta() // one-color-all.js and node.js only
    color.yellow()  // one-color-all.js and node.js only
    color.black()   // one-color-all.js and node.js only

Setters -- return new color instances with one channel changed:

    color.red(<number>)
    color.green(<number>)
    color.blue(<number>)
    color.hue(<number>)
    color.saturation(<number>)
    color.value(<number>)
    color.lightness(<number>)
    color.alpha(<number>)
    color.cyan(<number>)    // one-color-all.js and node.js only
    color.magenta(<number>) // one-color-all.js and node.js only
    color.yellow(<number>)  // one-color-all.js and node.js only
    color.black(<number>)   // one-color-all.js and node.js only

Adjusters -- return new color instances with the channel adjusted by
the specified delta (0..1):

    color.red(<number>, true)
    color.green(<number>, true)
    color.blue(<number>, true)
    color.hue(<number>, true)
    color.saturation(<number>, true)
    color.value(<number>, true)
    color.lightness(<number>, true)
    color.alpha(<number>, true)
    color.cyan(<number>, true)    // one-color-all.js and node.js only
    color.magenta(<number>, true) // one-color-all.js and node.js only
    color.yellow(<number>, true)  // one-color-all.js and node.js only
    color.black(<number>, true)   // one-color-all.js and node.js only

Comparison with other color objects, returns `true` or `false` (epsilon defaults to `1e-9`):

    color.equals(otherColor[, <epsilon>])


Mostly for internal (and plugin) use:
-------------------------------------

"Low level" constructors, accept 3 or 4 numerical arguments (0..1):

    new one.color.RGB(<red>, <green>, <blue>[, <alpha>])
    new one.color.HSL(<hue>, <saturation>, <lightness>[, <alpha>])
    new one.color.HSV(<hue>, <saturation>, <value>[, <alpha>])

The `one-color-all.js` build includes CMYK support:

    new one.color.CMYK(<cyan>, <magenta>, <yellow>, <black>[, <alpha>])

All color instances have `rgb()`, `hsv()`, and `hsl()` methods for
explicitly converting to another color space. Like the setter and
adjuster methods they return a new color object representing the same
color in another color space.

If for some reason you need to get all the channel values in a
specific colorspace, do an explicit conversion first to cut down on
the number of implicit conversions:

    var myColor = one.color('#0620ff').lightness(+.3).rgb();
    // Alerts '0 0.06265060240963878 0.5999999999999999':
    alert(myColor.red() + ' ' + myColor.green() + ' ' + myColor.blue());

Adding a colorspace implementation:

    one.color.installColorSpace(name, channelNames, {
        // Mandatory: Method for converting from your colorspace to RGB
        rgb: function () {
            // ...
            return new one.color.RGB(r, g, b, a);
        },

        // Mandatory: Method for converting from RGB to your colorspace
        // (will be installed as a method on RGB color instances)
        fromRgb: function () {
            // ...
            return new one.color.MyColorSpace(x, y, z, a);
        }
        // Optional: More methods for converting directly to other colorspaces.
        hsv: function () {
            // Method for converting from your colorspace to HSV...
            return new one.color.HSV(h, s, v, a);
        }
    });

See `HSL.js`, `HSV.js`, and `CMYK.js` in `lib/one/color` for examples.


Building
========

The Makefile uses <a href="https://github.com/One-com/assetgraph">AssetGraph</a>.

If you aren't up for a complete installation, there are pre-built
packages in the repository as well as the npm package:

* Basic library: <a href="https://raw.github.com/One-com/one-color/master/one-color.js">one-color.js</a>,
  debuggable version: <a href="https://raw.github.com/One-com/one-color/master/one-color-debug.js">one-color-debug.js</a>
* Full library including named color support: <a href="https://raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a>,
  debuggable version: <a href="https://raw.github.com/One-com/one-color/master/one-color-all-debug.js">one-color-all-debug.js</a>.

License
=======

one.color is licensed under a standard 3-clause BSD license -- see the LICENSE-file for details.
