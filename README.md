# Weather App

A sample weather app pulling data from OpenWeatherMap. [Currently live on phonghtran.com](http://phonghtran.com/labs/weatherApp).

A version that doesn't use the API can found [here](http://phonghtran.com/labs/weatherApp/noAPI.html).


## Build Process

Just download and open. jQuery included in files. 

## Thought Process

1. For time constraints, I went minimal over full utility. So it's just temperature and general weather condition.
2. In that mindset, I wanted to contrast existing apps with less photography and graphs and general clutter.
3. The amount of info was intended to let people roughly plan their day, and get a hint of the week's weather. 
4. The API also only allowed for fairly coarse time increments (3 hours), so decided to lean into that.
5. I did like the idea of different locations. Made it easier to test. Would be more useful if users could customize. 
6. Accessibility. Colors were pulled from Google Material Design. Choose a chunk thick font to stand up to the colors. Wouldn't pass AAA, and the lighter colors push the contrast at 3.64:1. Originally I was using black and bold versions of Biryani, but swapped the bold for regular for visual contrast. The bold at smaller sizes was losing legibility.
7. The icons were created with the typeface as the basis for the shapes. Needed more time to fully execute.


## Tradeoffs

1. I started the skeleton for search and geolocation, but had to cut it for time.
2. The responsive cutoffs are a bit rough. The 600-800 pixel range needs refinement. Landscape on mobile was treated as an edge case. 
3. Too much visual styling and HTML generation in the Javascript. It allowed me to generate color gradients on the fly. If I had committed to the style earlier, I probably would have turned them into CSS classes.
4. Went for super minimal data presentation in-lieu of stats like humidity and wind. Cleaner but less useful. 
5. The JS has a few cheats to save time like size-specific magic numbers and inefficient loops.
6. The intention was to pull shapes from the typeface to create the icons, but the timeframe didn't allow for much finesse.
7. Didn't use a framework. Seemed like overkill and didn't need the scaling. But still being in JS, you'll lose SEO for future development. Speed over robustness. 

## Wishlist

* Refactor JS to allow new location search
* Animations on cards when switching from view to search mode on mobile
* Lazy-load the backup weather data (currently it's just large JSON file that gets loaded every time)
* Current location gathering
* More accurate weather animations. I'd like to use OpenWeatherMap weather coding to modulate the intensity of the weather
* Subtle motion on the secondary icons
* A bit smarter object population on the canvas animation
* Motion on the clear weather state e.g. sun and moon
* Real favorite cities
* Recent search list to mesh with favorites list
* The weather states for "Atmosphere" is pretty varied, it'd be nice to add more animations and icons for that
* More robust animations, probably refactor to be more versatile
* Better redraw when resizing the browser
