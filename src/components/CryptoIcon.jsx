import React from "react";

import btcIconUrl from "cryptocurrency-icons/svg/color/btc.svg?url";
import ethIconUrl from "cryptocurrency-icons/svg/color/eth.svg?url";
import ltcIconUrl from "cryptocurrency-icons/svg/color/ltc.svg?url";
import usdtIconUrl from "cryptocurrency-icons/svg/color/usdt.svg?url";

const iconMap = {
	btc: btcIconUrl,
	eth: ethIconUrl,
	ltc: ltcIconUrl,
	usdt: usdtIconUrl
};

const FallbackIcon = () => <span className="inline-block">😀</span>;

function CryptoIcon({ ticker, currencyName, className = "w-5 h-5" }) {
	if (!ticker) {
		return <FallbackIcon />;
	}

	const iconUrl = iconMap[ticker.toLowerCase()];

	if (iconUrl) {
		return (
			<img
				src={iconUrl}
				alt={currencyName || ticker.toUpperCase()}
				className={className}
				loading="lazy"
			/>
		);
	}

	return <FallbackIcon />;
}

export default CryptoIcon;
