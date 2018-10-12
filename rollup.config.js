import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import butternut from 'rollup-plugin-butternut';

export default {
  plugins: [
    babel(),
    nodeResolve(),
    butternut()
  ]
};
