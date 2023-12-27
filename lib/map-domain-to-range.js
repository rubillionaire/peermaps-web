/**
 * map a value between the domain to the same
 * position in the range
 * @param  {Array} domain [number, number]
 * @param  {Array} range   [number, number]
 * @param  {number} valueInDomain
 * @return {number} valueInRange
 */
module.exports = function mapDomainToRange (domain, range, valueInDomain) {
  var domainExtent = domain[1] - domain[0]
  valueInDomain = Math.max(Math.min(valueInDomain, domain[1]), domain[0])
  var rangeExtent = range[1] - range[0]
  var percent = (valueInDomain - domain[0]) / domainExtent
  return range[0] + (rangeExtent * percent)
}
