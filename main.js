const canvas = document.querySelector("#myCanvas");
canvas.width= 240 ;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.8);
// car.controls.addKeyboardListeners();
const traffic = [new Car(road.getLaneCenter(1), 100, 30, 50, false, 2)];
const car = new Car(road.getLaneCenter(1), 400, 30, 50, true, 4);

animate();

function animate(){
    traffic.forEach(vehicle=>{
        vehicle.update(road.borders,null);
    });
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y+canvas.height*0.7);

    road.draw(ctx);
    traffic.forEach(vehicle=>vehicle.draw(ctx));
    car.draw(ctx);
    
    ctx.restore();
    requestAnimationFrame(animate);
}