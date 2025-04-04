import invariant from 'tiny-invariant';

import { useChannelById } from '@wsh-2025/client/src/features/channel/hooks/useChannelById';
import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';

interface Props {
  channelId: string;
}

export const ChannelTitle = ({ channelId }: Props) => {
  const channel = useChannelById({ channelId });
  invariant(channel);

  const width = useColumnWidth(channelId);

  return (
    <div className="relative">
      <div className={`border-x-solid h-[72px] w-auto border-x-[1px] border-x-[#212121] p-3.5`} style={{ width }}>
        <img
          loading="lazy"
          alt={channel.name}
          className="object-contains size-full"
          draggable={false}
          src={channel.logoUrl}
        />
      </div>

      <div className="absolute inset-y-0 right-[-4px] z-10 w-2">
        <Gutter channelId={channelId} />
      </div>
    </div>
  );
};
