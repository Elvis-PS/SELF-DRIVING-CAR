class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount=29;
        this.rayLength=200;
        this.raySpread = 2*Math.PI;
        this.rayTimer = 0;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic){
       this.#castRays();
       this.readings = [];
       for(let i = 0; i<this.rays.length; i++){
        this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
       }
    }

    #getReadings(ray, roadBorders, traffic){
         let touches = [];
         for(let i=0; i<roadBorders.length; i++){
            //getIntersection is a util method that returns an intersction object.
            const seeShouder = getIntersection(ray[0], ray[1],roadBorders[i][0], roadBorders[i][1]);
            if(seeShouder){
                 touches.push(seeShouder);
            } 
         }
         for(let i = 0; i<traffic.length; i++){
                const poly = traffic[i].polygon;
            for(let j=0; j<poly.length; j++){
                const seeCars = getIntersection(
                ray[0], ray[1], poly[j], poly[(j+1)%poly.length]);
                if(seeCars){
                    touches.push(seeCars);
                    console.log(seeCars);
                }
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
        this.rayTimer++;   
        this.rays.forEach((ray)=>{
            let end = ray[1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.lineWidth = 0.5;
            
            ctx.beginPath();
            console.log(this.rayTimer);
            
            if(this.rayTimer>30 && this.rayTimer<=60){
                ctx.setLineDash([5, 5])
            }
            else if(this.rayTimer>60){
                ctx.setLineDash([]); 
                this.rayTimer = 0;
            }

            ctx.strokeStyle = "red";
            ctx.moveTo(ray[0].x, ray[0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();


            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            i++;
        });
    }
}