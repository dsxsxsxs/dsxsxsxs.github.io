var canvas, gl;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var shaderProgram;
var lastTime = 0;
var rTri=0;
var n=3;
var mvMatrixStack=[];
var Beginvertices = [
[0.0, 0.0, 1.0],
[0.0, 0.942809, -0.33333],
[-0.816497, -0.471405, -0.333333],
[0.816497, -0.471405, -0.333333]
];

var vertices=[];
var colors=[];
function randomColor(){
    return [Math.random(),Math.random(),Math.random(), 1.0];
}
function triangle(va, vb, vc){
    vertices=vertices.concat(va);
    vertices=vertices.concat(vb);
    vertices=vertices.concat(vc);
    color=randomColor();
    for (var i=0; i<3; ++i)
        colors=colors.concat(color);
}

function tetra(a, b, c, d){
    triangle(a, b, c);
    triangle(a, c, d);
    triangle(a, d, b);
    triangle(b, d, c);
}

function divide_tetra(v, m)
{
	var a=v[0], b=v[1], c=v[2], d=v[3];
    var mid=[[],[],[],[],[],[]];
    var j;
    if(m>0){
        /* compute six midpoints */

        for(j=0; j<3; j++) mid[0][j]=(a[j]+b[j])/2;
        for(j=0; j<3; j++) mid[1][j]=(a[j]+c[j])/2;
        for(j=0; j<3; j++) mid[2][j]=(a[j]+d[j])/2;
        for(j=0; j<3; j++) mid[3][j]=(b[j]+c[j])/2;
        for(j=0; j<3; j++) mid[4][j]=(c[j]+d[j])/2;
        for(j=0; j<3; j++) mid[5][j]=(b[j]+d[j])/2;

        /* create 4 tetrahedrons by subdivision */

        divide_tetra([a, mid[0], mid[1], mid[2]], m-1);
        divide_tetra([mid[0], b, mid[3], mid[5]], m-1);
        divide_tetra([mid[1], mid[3], c, mid[4]], m-1);
        divide_tetra([mid[2], mid[4], d, mid[5]], m-1);

    }
    else tetra(a,b,c,d); /* draw tetrahedron at end of recursion */
}

function buildBuffers(){
    divide_tetra(Beginvertices, n);
    initBuffers(vertices, colors);
}
function init(){
	canvas=document.querySelector('#glcanvas');
	gl = canvas.getContext( "experimental-webgl" );
	gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
	initShaders();

    buildBuffers();
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	tick();
    // drawScene();
}
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;
      rTri += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}
 function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
// mat4.ortho( -2.0 * gl.viewportWidth/ gl.viewportHeight,2.0 * gl.viewportWidth/ gl.viewportHeight, -2.0, 2.0, -10.0, 10.0, pMatrix);
    // mat4.ortho(0, gl.viewportWidth, 0, gl.viewportHeight, 0.1, 100, pMatrix);
    mat4.ortho( -1.0, 1.0, -1.0, 1.0, 0.1, 100, pMatrix);
    mat4.identity(mvMatrix);
    mvPushMatrix();
    mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
    mat4.rotate(mvMatrix, degToRad(-60), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-rTri), [0, 0, 1]);
    // mat4.rotate(mvMatrix);
    // mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                           triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           triangleVertexPositionBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mvPopMatrix();

  }
