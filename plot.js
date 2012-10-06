$(function() {
var defZoom = 10
var zoom = defZoom
var offsetX = 0
var offsetY = 0

  var tempScrollTop, currentScrollTop = 0
  $("#canvas").mousewheel(function(event, delta, deltaX, deltaY) {
    if(delta == 1)
      zoomIn()
    else
      zoomOut()
  })

  $("#canvas").mousedown(function(e){
    $("#canvas").css({cursor: "move"})
    var initX = e.pageX-offsetX;
    var initY = e.pageY-offsetY;
    $(this).bind("mousemove", function(event) {
      offsetX = event.pageX-initX
      offsetY = event.pageY-initY
      plot(f)
    })
  }).mouseup(function(){
    $("#canvas").css({cursor: "default"})
    $(this).unbind("mousemove")
  })

  $(window).resize(function() {
    resizeCanvas()
  });

  $("#plotButton").click(function() {
    newF($("#input").val())
  })
  
  $("#input").keypress(function(e) {
    if(e.keyCode == 13)
      newF($("#input").val())
  })
  

  var functionToPlot = "Math.sin(x)*x/2"

  function f(x) {
      return eval(functionToPlot)
  }

  function newF(val) {
    var x=0;
    try {
      eval(val)
      functionToPlot = val
    }
    catch(err) {
      alert("Error: "+err)
    }

    zoom = defZoom
    plot(f)
  }

  function zoomOut() {
    zoom /= 1.25
    plot(f)
  }

  function zoomIn() {
    zoom *= 1.25
    plot(f)
  }

  function resizeCanvas() {
    W = $(document).width()-10
    H = $(document).height()-10
    
    canvas.attr({width: W})
    canvas.attr({height: H})

    canvas.width = W;
    canvas.height = H;
  
    plot(f)
  }

  function plot(f) {
    c.clearRect(0, 0, W, H)
    c.save()
    var Y = []
    var zeros = []

    c.translate(W/2+offsetX, H/2+offsetY)
    
    c.fillRect(-W/2-offsetX, 0, W, 1)
    c.fillRect(0, -H/2-offsetY, 1, H)
    
    var coefH = 1
    
    for(var x = -W/2-offsetX; x < W/2-offsetX; x++) {
      var _y = f(x/zoom)*zoom
      var dH = H/2
      
      //if((dH/_y < coefH && _y > 0) || (dH/_y > coefH && _y < 0))
	//coefH = dH/_y
      
      Y[x] = _y

      if(Math.round(_y) == 0)
	zeros.push(x)
    }
    
    c.beginPath()
    c.font = "15px monospace"
    c.textAlign = "right"
    c.textBaseline = "middle"
    
    for(var y = 0; y <= H/2-offsetY; y+=100) {
      if(y != 0) {
	c.fillText(Math.round(-((y/coefH)/zoom)*100)/100, -13, y)
	c.fillRect(-10, y, 20, 1)
      }
    }
    
    c.textAlign = "left"
    for(var y = 0; y >= -H/2-offsetY; y-=100) {
      c.fillText(Math.round(-((y/coefH)/zoom)*100)/100, 13, y)
      c.fillRect(-10, y, 20, 1)
    }
    
    for(var x = 0; x <= W/2-offsetX; x+=100) {
      if(x != 0) {
	c.save()
	c.translate(x, 20)
	c.rotate(Math.PI/4)
	c.fillText(Math.round((x/zoom)*100)/100, 0, 0)
	c.restore()
	c.fillRect(x, -10, 1, 20)
      }
    }
    
    for(var x = 0; x >= -W/2-offsetX; x-=100) {
      if(x != 0) {
	c.save()
	c.translate(x, 20)
	c.rotate(Math.PI/4)
	c.fillText(Math.round((x/zoom)*100)/100, 0, 0)
	c.restore()
	c.fillRect(x, -10, 1, 20)
      }
    }
    
    c.beginPath()
    for(var x = -W/2-offsetX; x <= W/2-offsetX; x++) {
      if(x == -W/2-offsetX)
	c.moveTo(x, -Y[x]*coefH)
      else
	c.lineTo(x, -Y[x]*coefH)
    }
    
    c.strokeStyle = "red"
    c.stroke()

    c.textAlign = "right"
    c.textBaseline = "bottom"
    c.strokeStyle = "blue"
    c.font = "12px monospace"
    
    for(zero in zeros) {
      var zero = zeros[zero]
      c.save()
      c.translate(zero, 0)
      c.rotate(Math.PI/4)
      c.fillStyle = "blue"
      c.fillText(Math.round((zero/zoom)*100)/100, -4, 0)
      c.restore()

      c.beginPath()
      c.fillStyle = "#66F"
      c.arc(zero, 0, 3, 0, Math.PI*2, true)
      c.fill()
      c.stroke()
    }
    
    c.restore()
  }
  
  canvas = $('#canvas')
  c = canvas[0].getContext("2d")
  resizeCanvas()
})
