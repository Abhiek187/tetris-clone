import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {

    //  Our game's entry point (edit as required)
    input: [
        './src/game.ts'
    ],

    //  Where the build file is to be generated.
    //  Most games being built for distribution can use iife as the module type.
    //  You can also use 'umd' if you need to ingest your game into another system.
    output: {
        file: './dist/game.js',
        name: 'MyGame',
        format: 'iife',
        sourcemap: false
    },

    plugins: [

        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
            preventAssignment: true,
            values: {
                'typeof CANVAS_RENDERER': JSON.stringify(true),
                'typeof WEBGL_RENDERER': JSON.stringify(true),
                'typeof EXPERIMENTAL': JSON.stringify(true),
                'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
                'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
                'typeof FEATURE_SOUND': JSON.stringify(true)
            }
        }),

        //  Parse our .ts source files
        resolve({
            extensions: [ '.ts', '.tsx' ]
        }),

        //  Convert CommonJS modules (like Phaser 3) into a format Rollup can use
        commonjs(),

        //  See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
        typescript(),

        //  Minify output for production
        terser()

    ]
};
