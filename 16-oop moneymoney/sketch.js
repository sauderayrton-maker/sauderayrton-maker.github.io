// inheritance
//

let mayCar;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //mayCar = new Vehicle("car", "Toyota");
  mayCar = new Car("Toyota");
  console.log(mayCar.getName());
  console.log(mayCar.getType());
}

function draw() {
  background(220);
}

class Vehicle {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }
}

class Car extends Vehicle {
  constructor(name) {
    super("car", name);
  }

  get name() {
    return "this is a car called " + super.getName();
  }
}
