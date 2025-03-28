import {Skeleton} from "@mantine/core";

interface LoadingViewProps {
  skeletonCount: number;
}

/**
 * Use this as a filler for any page content that requires loading.
 * @constructor
 */
export default function LoadingView({ skeletonCount = 15 }: LoadingViewProps) {
  return (
    <>
      {Array(skeletonCount)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} mt="sm" animate/>
        ))}
    </>
  )
}