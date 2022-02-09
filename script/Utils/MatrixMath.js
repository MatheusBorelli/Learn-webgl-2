export const Matrix3 = {
    identity: function(){
        return [
            1 , 0 , 0 ,
            0 , 1 , 0 ,
            0 , 0 , 1
        ]
    },
    
    projection: function( width , height ){
        return [
            2 / width,   0, 0,
            0, 2 / height, 0,
            -1, -1, 1
        ];
    },

    multiply: function(a , b){
        return [
            b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
            b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
            b[0] * a[2] + b[1] * a[5] + b[2] * a[8],

            b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
            b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
            b[3] * a[2] + b[4] * a[5] + b[5] * a[8],

            b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
            b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
            b[6] * a[2] + b[7] * a[5] + b[8] * a[8],
        ]
    },

    translate: function( matrix , translateX , translateY){
        return Matrix3.multiply( matrix , Matrix3.translationMatrix( translateX , translateY ));
    },
    
    rotate: function( matrix , rotateX , rotateY){
        return Matrix3.multiply( matrix , Matrix3.rotationMatrix( rotateX , rotateY ));
    },
    
    scale: function( matrix , scaleX , scaleY){
        return Matrix3.multiply( matrix , Matrix3.scalingMatrix( scaleX , scaleY ));
    },

    translationMatrix: function(translationX, translationY) {
        return [
                       1,           0,  0,
                       0,           1,  0,
            translationX, translationY, 1,
        ];
    },

    rotationMatrix: function(angleInRadians){
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },

    scalingMatrix: function(scaleX, scaleY){
        return [
            scaleX, 0,      0,
            0,      scaleY, 0,
            0,      0,      1,
        ];
    }   
}