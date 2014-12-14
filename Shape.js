function Shape() {}
Shape.prototype.X = 0;
Shape.prototype.Y = 0;

Shape.prototype.move = function(x, y) {
    this.X = x;
    this.Y = y;
};

Shape.prototype.distFromOrigin = function() {
   return Math.sqrt(this.X * this.X + this.Y * this.Y);
};

Shape.prototype.area = function() {
    throw new Error('not supported method!');
}


function Square() {}

Square.prototype = Object.create(Shape.prototype);

Square.prototype.Width = 0;

Square.prototype.area = function() {
    return this.Width * this.Width;
}

function Rectangle() {}
Rectangle.prototype = Object.create(Square.prototype);
Rectangle.prototype.Height = 0;

Rectangle.prototype.area = function() {
    return this.Width * this.Height;
}


var s = new Shape();
s.move(10,10);
console.log(s.distFromOrigin());

var sq = new Square();
sq.move(5,5);
sq.Width = 15;
console.log(sq.distFromOrigin());
console.log(sq.area());

var rect = new Rectangle();
rect.move(3,2);
rect.Width = 10;
rect.Height = 6;
console.log(rect.distFromOrigin());
console.log(rect.area());



