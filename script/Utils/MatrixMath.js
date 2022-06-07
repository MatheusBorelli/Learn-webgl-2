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

    orthographic: function(left, right, bottom, top){
        return [
            2/(right - left), 0 , 0,
            0 , 2/(top - bottom), 0,
            
            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            1
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
    
    shear: function( matrix , shearX , shearY){
        return Matrix3.multiply( matrix , Matrix3.shearMatrix( shearX , shearY ));
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
    },
    shearMatrix: function(shearX , shearY){
        return [
            1,      shearY,   0,
            shearX,   1,      0,
            0,        0,      1,
        ];
    }
}

export const Matrix4 = {
    identity: () => [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],

    projection: (width, height, depth) => [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
        -1, 1, 0, 1
    ],
    
    orthographic: (left, right, bottom, top, near, far) => [
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, 2 / (near - far), 0,

        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1
    ],

    perspective: (fieldOfViewInRadians, aspect, near, far) => {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
        
        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    },
    
    translate: (matrix, translateX, translateY, translateZ) => Matrix4.multiply(matrix, Matrix4.translationMatrix(translateX, translateY, translateZ)),
     
    xRotate: (matrix, angleInRadians) => Matrix4.multiply(matrix, Matrix4.xRotationMatrix(angleInRadians)),
    
    yRotate: (matrix, angleInRadians) => Matrix4.multiply(matrix, Matrix4.yRotationMatrix(angleInRadians)),
    
    zRotate: (matrix, angleInRadians) => Matrix4.multiply(matrix, Matrix4.zRotationMatrix(angleInRadians)),
    
    scale: (matrix, scaleX, scaleY, scaleZ) => Matrix4.multiply(matrix, Matrix4.scalingMatrix(scaleX, scaleY, scaleZ)),

    multiply: (a, b) => [
        b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
        b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
        b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
        b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
        b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
        b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
        b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
        b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
        b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
        b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
        b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
        b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
        b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
        b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
        b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
        b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
    ],

    translationMatrix: (translateX, translateY, translateZ) => [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translateX, translateY, translateZ, 1,
    ],
     
    xRotationMatrix: (angleInRadians) => {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotationMatrix: (angleInRadians) => {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotationMatrix: (angleInRadians) => {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    scalingMatrix: (scaleX, scaleY, scaleZ) => [
        scaleX, 0, 0, 0,
        0, scaleY, 0, 0,
        0, 0, scaleZ, 0,
        0, 0, 0, 1,
    ]    
}