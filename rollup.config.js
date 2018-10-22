import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import butternut from 'rollup-plugin-butternut';

export default {
  plugins: [
    buble(),
    nodeResolve(),
    butternut()
  ]
};
