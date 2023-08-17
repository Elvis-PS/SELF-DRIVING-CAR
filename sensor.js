class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount=30;
        this.rayLength=300;
        this.raySpread = Math.PI/2;

        this.rays = [];
    }

    update(){
        this.rays=[];
        for(let i = 0; i<this.rayCount; i++){
            const rayAngle = lerp(this.raySpread/2,-this.raySpread/2, 
            this.rayCount===1?0.5:i/(this.rayCount-1)) + this.car.angle;

            const start = {x:this.car.x, y:this.car.y};
            const end = {
                x:this.car.x - Math.sin(rayAngle)*this.rayLength, y:this.car.y-Math.cos(rayAngle) *this.rayLength
            };
            this.rays.push([start, end]);
        }
    }
    draw(ctx){
        this.rays.forEach((ray)=>{
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(ray[1].x, ray[1].y);
            ctx.stroke();
        })
    }
}