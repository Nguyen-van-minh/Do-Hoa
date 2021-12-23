
"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 mặt) (2 hình tam giác / mặt) (3 đỉnh / hình tam giác)

var points = [];
var colors = [];
var colors2 = [];

var key_flag = false;

var cube_vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [// tập các màu
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black 
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red 
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow 
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];



var BASE_HEIGHT     = 7.0;
var BASE_WIDTH      = 5.0;
var HEAD_HEIGHT     = 3.0;
var HEAD_WIDTH      = 3.0;
var ANTENNA_HEIGHT  = 3.0;
var ANTENNA_WIDTH   = 0.5;
var ARM_WIDTH       = 1.0;
var ARM_HEIGHT      = 5.0;


var modelViewMatrix, projectionMatrix;

var theta = [ 0, 0, 0]; 
var distance_scale = 1;

var modelViewMatrixLoc;

var vBuffer;
var buffers = [];

var event = 
{
    right : {val : false, var : 0.0},
    left : {val : false, var : 0.0},
    colors : {val : false},
    turn : {val : false, var : 0.0},
};

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d, clrs, alt, vertices ) {
    colors.push(vertexColors[clrs[0]]);
    points.push(vertices[a]);
    colors.push(vertexColors[clrs[1]]);
    points.push(vertices[b]);
    colors.push(vertexColors[clrs[2]]);
    points.push(vertices[c]);
    colors.push(vertexColors[clrs[3]]);
    points.push(vertices[a]);
    colors.push(vertexColors[clrs[4]]);
    points.push(vertices[c]);
    colors.push(vertexColors[clrs[5]]);
    points.push(vertices[d]);

    colors2.push(vertexColors[alt[0]]);
    colors2.push(vertexColors[alt[1]]);
    colors2.push(vertexColors[alt[2]]);
    colors2.push(vertexColors[alt[3]]);
    colors2.push(vertexColors[alt[4]]);
    colors2.push(vertexColors[alt[5]]);
}

function eye() { // mắt
    quad( 1, 0, 3, 2, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
    quad( 2, 3, 7, 6, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
    quad( 3, 0, 4, 7, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
    quad( 6, 5, 1, 2, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
    quad( 4, 5, 6, 7, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
    quad( 5, 4, 0, 1, [3,3,3,3,3,3], [5,5,5,5,5,5], cube_vertices );
}

function a() { // mắt
    quad( 1, 0, 3, 2, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
    quad( 2, 3, 7, 6, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
    quad( 3, 0, 4, 7, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
    quad( 6, 5, 1, 2, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
    quad( 4, 5, 6, 7, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
    quad( 5, 4, 0, 1, [4,4,4,4,4,4], [5,5,5,5,5,5], cube_vertices );
}


function body() {
    var body_vertices = [
            vec4( -0.25, -0.25,  0.25, 1.0),
            vec4( -0.5,  0.5,  0.5, 1.0), 
            vec4( 0.5,  0.5,  0.5, 1.0), 
            vec4( 0.25, -0.25,  0.25, 1.0),
            vec4( -0.25, -0.25, -0.25, 1.0), 
            vec4( -0.5,  0.5, -0.5, 1.0), 
            vec4( 0.5,  0.5, -0.5, 1.0), 
            vec4( 0.25, -0.25, -0.25, 1.0)
    ];
    // quad( 1, 0, 3, 2, [1,5,4,1,4,7], [1,1,1,1,1,1], body_vertices );
    quad( 1, 0, 3, 2, [1,5,4,1,4,7], [1,1,1,1,1,1], body_vertices );
    quad( 2, 3, 7, 6, [1,5,4,1,4,7], [3,3,3,3,3,3], body_vertices );
    quad( 3, 0, 4, 7, [1,5,4,1,4,7], [4,4,4,4,4,4], body_vertices );
    quad( 6, 5, 1, 2, [1,5,4,1,4,7], [7,7,7,7,7,7], body_vertices );
    quad( 4, 5, 6, 7, [1,5,4,1,4,7], [3,3,3,3,3,3], body_vertices );
    quad( 5, 4, 0, 1, [1,5,4,1,4,7], [4,4,4,4,4,4], body_vertices );
}

function cube() { //  tay, chân, ăng ten, đầu
    quad( 1, 0, 3, 2, [1,5,4,1,4,7], [1,1,1,1,1,1], cube_vertices );
    quad( 2, 3, 7, 6, [1,5,4,1,4,7], [3,3,3,3,3,3], cube_vertices );
    quad( 3, 0, 4, 7, [1,5,4,1,4,7], [4,4,4,4,4,4], cube_vertices );
    quad( 6, 5, 1, 2, [1,5,4,1,4,7], [2,2,2,2,2,2], cube_vertices );
    quad( 4, 5, 6, 7, [1,5,4,1,4,7], [3,3,3,3,3,3], cube_vertices );
    quad( 5, 4, 0, 1, [1,5,4,1,4,7], [4,4,4,4,4,4], cube_vertices );
}

function input()
{
	document.getElementById("slider1").onchange = function(event) { theta[0] = event.target.value;  };
    document.getElementById("slider2").onchange = function(event) { theta[1] = event.target.value;  };
    document.getElementById("slider3").onchange = function(event) { theta[2] =  event.target.value; };
    document.getElementById("distance").onchange = function(event) { distance_scale = event.target.value; };
    
    document.addEventListener('keyup', function(e) 
    {
        if(!key_flag)
        { 
            key_flag = true;
            // console.log(e.keyCode);
            // console.log(String.fromCharCode(e.keyCode));
            switch(String.fromCharCode(e.keyCode).toLowerCase())
            {
                case "c": event.colors.val ^= 1; break;//^= thao tác với bit               
                case "t": event.turn.val = true; break;
                case "r": event.right.val = true; break;
                case "l": event.left.val = true; break;
            }
        }
    });
    document.addEventListener('keydown',function(e){key_flag = false;});
}

//----------------------------------------------------------------------------


function base() {// vẽ thân
    var s = scalem(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, -0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
}

//----------------------------------------------------------------------------
function b() {// 
    var s = scalem(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 1, -0.5 , 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 36, NumVertices );
}

function antenna() {
    var s = scalem(ANTENNA_WIDTH, ANTENNA_HEIGHT, ANTENNA_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * ANTENNA_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------
function head()
{
    var s = scalem(HEAD_WIDTH, HEAD_HEIGHT, HEAD_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * HEAD_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------
function right_arm(arm) {
    var right_formula = 0;
    if(event.right.val && arm)
    {
        right_formula = 200*Math.sin((1/64)*event.right.var)
                    +((200*Math.sin(3*(1/64)*event.right.var))/3) 
                    +((200*Math.sin(5*(1/64)*event.right.var))/5) 
                    +((200*Math.sin(7*(1/64)*event.right.var))/3);
        ++event.right.var;
        if(right_formula < 0)
        {
            event.right.var = 0;
            right_formula = 0; 
            event.right.val = false;
            
        }
    }

    var s = scalem(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    var instanceMatrix = mult(rotate(right_formula,-2.5,-0.6,0),s);
    instanceMatrix  = mult(instanceMatrix, translate( -2.5, -0.6, 0.0 ));    
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function left_arm(arm) {
    var left_formula = 0;
    if(event.left.val && arm)
    {
        left_formula = 200*Math.sin((1/64)*event.left.var)
                    +((200*Math.sin(3*(1/64)*event.left.var))/3) 
                    +((200*Math.sin(5*(1/64)*event.left.var))/5) 
                    +((200*Math.sin(7*(1/64)*event.left.var))/3);
        ++event.left.var;
        // console.log(event.left.var);
        // console.log(left_formula);
        if(left_formula < 0)
        {
            event.left.var = 0;
            left_formula = 0; 
            event.left.val = false;
            
        }
    }

    var s = scalem(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    var instanceMatrix = mult(rotate(-left_formula,2.5,-0.6,0),s);
    instanceMatrix  = mult(instanceMatrix, translate( 2.5, -0.6, 0.0 ));    
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function right_foot() {
    var s = scalem(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    var instanceMatrix = mult(rotate(-7,0,0,1),s);
    instanceMatrix  = mult(instanceMatrix, translate( -2.5, -0.6, 0.0 ));    
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function left_foot() {
    var s = scalem(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    var instanceMatrix = mult(rotate(7,0,0,1),s);
    instanceMatrix  = mult(instanceMatrix, translate( 2.5, -0.6, 0.0 ));    
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function eyes()
{ 
    var s = scalem(0.5,1,0.5);
    var instanceMatrix = mult( translate( 0.0, 0.5 * HEAD_HEIGHT, 1.5 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 72, NumVertices );
}

var render = function() {
    input();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffers[event.colors.val?1:0] );
    gl.vertexAttribPointer( gl.getAttribLocation( program, "vColor" ), 4, gl.FLOAT, false, 0, 0 );
   
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );//xóa màn hình với giá trị màu cho trước đòng thời xóa bộ đệm chiều xâu
    
    modelViewMatrix = mat4(1); 
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[0], 0, 1, 0 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[1], 1, 0, 0 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[2], 0, 0, 1 ));
    modelViewMatrix = mult(modelViewMatrix, scalem(distance_scale,distance_scale,distance_scale));

    if(event.turn.val) if(++event.turn.var%360 == 0) event.turn.val =  false;
    
    modelViewMatrix = mult(modelViewMatrix, rotate(event.turn.var, 0, 1, 0 ));

    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, 3, 0.0));
    base();

    var a = modelViewMatrix;
    
    head();
    modelViewMatrix = mult(modelViewMatrix, translate(-1,0,0));
    eyes();
    modelViewMatrix = mult(modelViewMatrix, translate(2,0,0));
    eyes();
    modelViewMatrix = a;
    
    modelViewMatrix  = mult(modelViewMatrix, translate(-1.0, HEAD_HEIGHT-1, 0.0));
    var temp = modelViewMatrix;
    modelViewMatrix  = mult(modelViewMatrix, rotate(12, 0, 0, 1) );
    antenna();
    modelViewMatrix = temp;
    modelViewMatrix  = mult(modelViewMatrix, translate(2.0, 0, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(-12, 0, 0, 1) );
    antenna();

    modelViewMatrix = a;
    right_arm(true);
    left_arm(true);

    modelViewMatrix = mult(a, translate(-2,-BASE_HEIGHT+2,0));
    left_foot();
   
    modelViewMatrix = mult(modelViewMatrix, translate(4,0,0));
    right_foot();
    requestAnimFrame(render);
}

//____________________________________________

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );// kích hoạt chiều xâu

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cube();
    body();
    eye();
    a();
    // program = initShaders( gl, "vertex-shader", "fragment-shader" );
    // gl.useProgram( program );  

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    buffers[0] = gl.createBuffer();// 
    gl.bindBuffer( gl.ARRAY_BUFFER, buffers[0] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    buffers[1] = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffers[1] );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}
