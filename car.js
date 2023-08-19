class Car{
    constructor (x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        
        this.sensor = new Sensor(this); 
        this.controls = new Controls();
    }

    update(roadBorders){
        if(!this.damaged){            
            this.#move();     
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);   
    }

    #assessDamage(roadBorders){
        for(let i = 0; i<roadBorders.length; i++){
            if(polyIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width, this.height)/2;
        // this math method return the angle based on the base and oposite
        const alpha = Math.atan2(this.width, this.height); 

        //here we push the points of the polygon into the poits array
        points.push({x:this.x-Math.sin(this.angle-alpha)*rad, y:this.y-Math.cos(this.angle-alpha)*rad});

        points.push({x:this.x-Math.sin(this.angle+alpha)*rad, y:this.y-Math.cos(this.angle+alpha)*rad});

        points.push({x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad, y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad});

        points.push({x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad, y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad});

        return points;

    }

    #move(){
        // forward reverse controls
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        } 

        //speed changing
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }

        // left right controls
        if(this.speed !=0){
            //flip changes the sign of the angle depending on the direction -- forward/reverse
            const flip = this.speed>0?1:-1;
            if(this.controls.left){
                this.angle +=0.03 * flip;
            }
            if(this.controls.right){
                this.angle -=0.03 * flip; 
            }
        }
        
        this.x -=Math.sin(this.angle)*this.speed;
        this.y -=Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        ctx.save();

        
        if(this.damaged){
            ctx.fillStyle="red";
        }else ctx.fillStyle = "blue";


        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}