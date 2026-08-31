import { FaArrowRight, FaGlobe, FaStore, FaRocket } from 'react-icons/fa6'
import { CAMPAIGNS } from '../data'

/**
 * The bridge from a strategy back into campaign management.
 *
 * Every strategy section that references campaigns renders one of these, so the
 * link is available wherever campaigns are mentioned rather than only on one
 * dedicated tab.
 *
 *   <CampaignLinks ids={[0, 3]} onOpenCampaign={fn} onOpenCampaigns={fn} />
 */

export function campaignsByIds(ids = []) {
  return ids.map((id) => CAMPAIGNS.find((c) => c.id === id)).filter(Boolean)
}

/** Compact clickable chip — used inside phases and other inline contexts. */
export function CampaignChip({ campaign, onOpen }) {
  const Icon = campaign.category === 'physical' ? FaStore : FaGlobe
  return (
    <button className="camp-chip" onClick={() => onOpen(campaign.id)} title={campaign.meta}>
      <Icon style={{ fontSize: 9 }} />
      {campaign.title}
    </button>
  )
}

/**
 * Full campaign list with status, progress and a link per campaign.
 *
 * @param {number[]} ids               campaigns to show
 * @param {function} onOpenCampaign    (id) => open that campaign's detail page
 * @param {function} [onOpenCampaigns] () => open campaign management
 * @param {string}   [title]           section heading; omit to render bare
 * @param {string}   [emptyNote]       shown when no campaigns are linked yet
 */
export default function CampaignLinks({
  ids,
  onOpenCampaign,
  onOpenCampaigns,
  title,
  emptyNote = 'No campaigns linked to this yet.',
  compact = false,
}) {
  const list = campaignsByIds(ids)

  return (
    <div className="camp-links">
      {(title || onOpenCampaigns) && (
        <div className="camp-links-hd">
          {title && <span className="camp-links-title"><FaRocket /> {title}</span>}
          {onOpenCampaigns && (
            <button className="camp-links-all" onClick={onOpenCampaigns}>
              Open campaign management <FaArrowRight style={{ fontSize: 9 }} />
            </button>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <div className="camp-links-empty">{emptyNote}</div>
      ) : compact ? (
        <div className="camp-chips">
          {list.map((c) => <CampaignChip campaign={c} onOpen={onOpenCampaign} key={c.id} />)}
        </div>
      ) : (
        <div className="camp-rows">
          {list.map((c) => {
            const Icon = c.category === 'physical' ? FaStore : FaGlobe
            return (
              <button className="camp-row" key={c.id} onClick={() => onOpenCampaign(c.id)}>
                <span className="camp-row-emoji">{c.emoji}</span>
                <span className="camp-row-main">
                  <span className="camp-row-title">
                    {c.title}
                    <span className={'cat-badge cat-' + c.category}>
                      <Icon style={{ fontSize: 8 }} /> {c.category}
                    </span>
                  </span>
                  <span className="camp-row-meta">{c.meta}</span>
                  <span className="pbar" style={{ marginTop: 8 }}>
                    <span className="pfill" style={{ width: c.progress + '%', display: 'block', height: '100%' }} />
                  </span>
                </span>
                <span className="camp-row-right">
                  <span className={'tag ' + c.statusCls}>{c.status}</span>
                  <span className="camp-row-open">Open <FaArrowRight style={{ fontSize: 9 }} /></span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
