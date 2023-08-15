 
 class Road{
    constructor(x, width, laneCount=3){
        this.x = x;
        this.width= width;
        this.laneCount = laneCount;

        this.left = x - width/2;
        this.right = x + width/2;

        const infinity = 100000; 
        this.top =-infinity;
        this.bottom = infinity;  
    }

    getLaneCenter(laneIndex){
        const lineWidth = this.width/this.laneCount;
        return this.left+lineWidth/2;
    }

    draw(ctx){
        // draw line on the side of the road
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue"; 

        for(let i = 0; i <= this.laneCount; i++){
            const line = lerp(this.left, this.right, i/this.laneCount);  

            if(i>0 && i<this.laneCount){
                ctx.setLineDash([20,20]);
            }else{
                ctx.setLineDash([]);
            }

            ctx.beginPath();
            ctx.moveTo(line, this.top);
            ctx.lineTo(line, this.bottom);
            ctx.stroke();
        }
    }    
}