class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount=30;
        this.rayLength=300;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders){
       this.#castRays();
       this.readings = [];
       for(let i = 0; i<this.rays.length; i++){
        this.readings.push(this.#getReadings(this.rays[i], roadBorders));
       }
    }

    #getReadings(ray, roadBorders){
         let touches = [];
         for(let i=0; i<roadBorders.length; i++){
            //getIntersection is a util method that returns an intersction object.
            const touch = getIntersection(ray[0], ray[1],roadBorders[i][0], roadBorders[i][1]);
            if(touch){
                 touches.push(touch);
            } 
         }
         if(touches.length===0){
            return null;  
         }else{
            const offsets = touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);

            const closestTouch = touches.find(e=>e.offset==minOffset);
            return closestTouch;
         }
    }

    #castRays(){
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
        let i = 0;
        this.rays.forEach((ray)=>{
            let end = ray[1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            i++;
        });
    }
}