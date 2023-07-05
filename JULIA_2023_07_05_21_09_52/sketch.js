// global variables
var xRange
var yRange
var maxIterations
var coords

function setup() {
  
  createCanvas( windowWidth, windowHeight )
  // input data (center point, max number of iterations for coloring, width of view, resolution)
  let Cr = parseFloat( prompt("Cr: "))
  let Ci = parseFloat( prompt("Ci: "))
  let x = parseFloat( prompt( "x:" ) ) // x-coord of center point
  let y = parseFloat( prompt( "y:" ) ) // y-coord of center point
  let maxIterations = parseInt( prompt( "maximum iterations:" ) ) // maximum number of iterations to visualize 
  let w = parseFloat( prompt( "width:" ) ) // width of view
  let res = parseFloat( prompt( "resolution (0-1):" ) ) // resolution
  coords = parseInt(prompt("do you want to see coordinates? (1=yes, 0=no): ")) // ask if user wants to see coordinates of cursor
  
  let p = [ x,y ]
  let h = ( windowHeight * w ) / windowWidth // use dimensions of screen to calculate height
  
  // Define range of x- and y-values to draw based on data inputed
  xRange = [ p[ 0 ] - ( w / 2 ), p[ 0 ] + ( w / 2 ) ]
  yRange = [ p[ 1 ] - ( h / 2 ), p[ 1 ] + ( h / 2 ) ]
  
  // Define how much to increment between x and y values based on resolution
  xIncrement = ( w / windowWidth ) / res
  yIncrement = ( h / windowHeight ) / res
  
  // Draw the Mandelbrot Set 
  for ( let r = xRange[ 0 ]; r <= xRange[ 1 ]; r += xIncrement ) { // Loop through all real numbers (i.e, the x-values)
    
    for ( let i = yRange[ 0 ]; i <= yRange  [ 1 ]; i += yIncrement ) { // Loop through all "imaginary" numbers (i.e, the y-values)
      
      let result = julia( 0, r, i, Cr, Ci ) // Determine if the point (r,i) is in the set
      
      if ( result == true ) { // If (r,i) is in the set
        
        plotPoint( r, i, "black" ) // Plot a black dot at (r,i)
        
      } else { // If (r,i) is NOT in the set
        
        plotPoint( r, i, c( result, maxIterations ) ) // Plot a dot at (r,i) with a color based on the number of iterations it took for either r or i to exceed 2
        
      }
      
    } 
    
  }
  
}

// Continuously update the position of the cursor and display it
function draw() {
  if(coords == 1){
  fill( "white" )
  rect( 0, 0, 320, 40 )
  

  let x = round( map( mouseX, 0, width, xRange[ 0 ], xRange[ 1 ] ), 10 )
  let y = round( map( mouseY, height, 0, yRange[ 0 ], yRange[ 1 ] ), 10 )
  
  fill( "black" )
  stroke(2)
  textSize(20)
  text( x + " + " + y + "i", 10, 30 )
  
  }
  
}

// Add 2 complex numbers 
// R + I + R + I
function complexAdd(r1, i1, r2, i2){
  return [r1+r2, i1+i2]
}

// Multiply 2 complex numbers (using FOIL)
// (R+I)(R+I)
function complexMultiply( r1, i1, r2, i2 ) {
  
  return [ ( r1 * r2 ) - ( i1 * i2 ), ( r1 * i2 ) + ( i1 * r2 ) ]
  
}

// Plot a <color> point at r, i
function plotPoint( r, i, color ) {
  
  strokeWeight(2.5)
  stroke(color)
  
  point( map( r, xRange[0], xRange[ 1 ], 0, width ), map( i, yRange[ 0 ], yRange[ 1 ], height, 0 ) )
  
}

// Determine if [Cr,Ci] lies in the Mandelbrot Set by iterating through the sequence Z_n+1 = (Z_n)^2 + C, where both Z and C are complex numbers
function julia( n, Zr, Zi, Cr, Ci ) {
  
  if ( Zr >= 2 || Zr <= -2 || Zi >= 2 || Zi <= -2 ) { // If either the real or imaginary part of |Z| exceeds 2, C is not in the Mandelbrot Set. Stop the recursion.
    return n // return the amount of iterations it took for |Z| to exceed 2 (real or imaginary part)
    
  }
  
  if ( n > 1000 ) { // If the sequence has iterated 1000 times, C is MOST LIKELY in the Mandelbrot Set (there is uncertainty at the border)
    
    return true
    
  }
  
  
  // If neither of the previous conditions were met, continue the iteration of the following sequence: Z_n+1 = (Z_n)^2 + C
  
  let ZnSquared = complexMultiply( Zr, Zi, Zr, Zi ) // (Z_n)^2 term
  
  let sum = complexAdd( ZnSquared[ 0 ], ZnSquared[ 1 ], Cr, Ci ) // Add C to (Z_n^2) to calculate Z_n+1
  
  return julia( ++n, sum[ 0 ], sum[ 1 ], Cr, Ci ) // Repeat this whole process for the next term of the sequence
  
}

// Take a number of iterations for a specific point around the Mandelbrot Set, n, and a maximum number of iterations, maxit (inputted before set is generated), and determine the appropriate color to use by mapping the amount of iterations to the RGB scale (0 to 255)
function c(n, maxit){
  return color(map(n,0,maxit,0,255),0,0)
}